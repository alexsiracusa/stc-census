from typing import Optional, Tuple
from collections import defaultdict, deque
from datetime import date
import pandas as pd
import numpy as np

from fastapi import HTTPException
from .cpm import compute_cpm
from ..database import data

# Helper function: if a user-supplied date falls on a weekend, push it to the following Monday.
def adjust_if_weekend(d: date) -> date:
    d_ts = pd.Timestamp(d)
    if d_ts.weekday() == 5:  # Saturday
        return (d_ts + pd.Timedelta(days=2)).date()
    elif d_ts.weekday() == 6:  # Sunday
        return (d_ts + pd.Timedelta(days=1)).date()
    return d


# Helper function: count number of business days (Monday-Friday) between two date objects.
def business_days_between(start: date, end: date) -> int:
    start_np = np.datetime64(start)
    end_np = np.datetime64(end)
    # np.busday_count returns the number of business days between start (inclusive) and end (exclusive)
    return int(np.busday_count(start_np, end_np))


def schedule_tasks(end_date: int, tasks_df: pd.DataFrame) -> pd.DataFrame:
    """
    Schedule tasks using the Spread strategy.
    NOTE: Here durations are interpreted as working days.
    """
    tasks = []
    for row in tasks_df.to_dict('records'):
        task_id = row['id']
        es = row['earliest_start']
        ee = row['earliest_finish']
        ls = row['latest_start']
        le = row['latest_finish']
        slack = row['slack']
        is_critical = row['is_critical']
        dependencies = row['dependencies']
        target_days = row['target_days_to_complete']  # assumed to be working days
        deps_task_ids = [tasks_df.iloc[idx]['id'] for idx in dependencies]
        tasks.append((task_id, es, ee, ls, le, slack, is_critical, deps_task_ids, target_days))

    task_map = {}
    for t in tasks:
        task_id, es, ee, ls, le, slack, is_critical, deps, target_days = t
        task_map[task_id] = {
            'id': task_id,
            'earliest_start': es,
            'earliest_finish': ee,
            'latest_start': ls,
            'latest_finish': le,
            'slack': slack,
            'is_critical': is_critical,
            'dependencies': deps,
            'duration': target_days  # Working days
        }

    successors = defaultdict(list)
    in_degree = defaultdict(int)
    for t in task_map.values():
        for dep in t['dependencies']:
            successors[dep].append(t['id'])
        in_degree[t['id']] = len(t['dependencies'])

    topo_order = []
    queue = deque([t_id for t_id in task_map if in_degree[t_id] == 0])
    while queue:
        node = queue.popleft()
        topo_order.append(node)
        for succ in successors[node]:
            in_degree[succ] -= 1
            if in_degree[succ] == 0:
                queue.append(succ)

    reverse_successors = defaultdict(list)
    for t in task_map.values():
        for dep in t['dependencies']:
            reverse_successors[t['id']].append(dep)

    reverse_topo_order = []
    pred_counts = defaultdict(int)
    for t in task_map.values():
        for dep in t['dependencies']:
            pred_counts[dep] += 1

    rev_queue = deque([t_id for t_id in task_map if not successors[t_id]])
    while rev_queue:
        node = rev_queue.popleft()
        reverse_topo_order.append(node)
        for pred in reverse_successors.get(node, []):
            pred_counts[pred] -= 1
            if pred_counts[pred] == 0:
                rev_queue.append(pred)

    new_LS = {}
    new_LE = {}
    target_duration = end_date
    for t_id in reverse_topo_order:
        t = task_map[t_id]
        if not successors[t_id]:
            new_LE[t_id] = target_duration
        else:
            new_LE[t_id] = min(new_LS[succ] for succ in successors[t_id])
        new_LS[t_id] = new_LE[t_id] - t['duration']

    schedule = {}

    # Schedule critical tasks at their earliest start.
    critical_tasks = [t_id for t_id in task_map if task_map[t_id]['is_critical']]
    for t_id in critical_tasks:
        t = task_map[t_id]
        start = t['earliest_start']
        end = start + t['duration']
        schedule[t_id] = (start, end)

    # Schedule non-critical tasks by “spreading” them over the available slack.
    non_critical = [t_id for t_id in topo_order if not task_map[t_id]['is_critical']]
    n = len(non_critical)
    for idx, t_id in enumerate(non_critical):
        t = task_map[t_id]
        if not t['dependencies']:
            earliest_start = 0
        else:
            earliest_start = max(schedule[dep][1] for dep in t['dependencies'])

        available_slack = new_LS[t_id] - earliest_start

        if available_slack <= 0:
            start_time = earliest_start
        else:
            if n > 1:
                offset = (available_slack * idx) // (n - 1)
            else:
                offset = 0
            start_time = earliest_start + offset

        start_date = start_time
        end_date_task = start_date + t['duration']
        schedule[t_id] = (start_date, end_date_task)

    result_data = []
    for t_id, (start, end) in schedule.items():
        result_data.append({
            'task_id': t_id,
            'start_date': start,  # these are offsets expressed in working days
            'end_date': end
        })

    return pd.DataFrame(result_data)


def convert_and_adjust_schedule(schedule_df: pd.DataFrame, diff: int, mode: int, wanted_start: date) -> (pd.DataFrame, date):
    """
    Given a schedule with “working day offsets” convert these into actual dates by adding business day offsets.
    If the schedule’s overall duration (i.e. the CPM minimum) is longer than what the user requested (diff < 0)
    then the project start date is adjusted backward (using business day arithmetic) so that none of the
    scheduled tasks starts on a weekend.
    """
    wanted_start_ts = pd.Timestamp(wanted_start)
    if diff < 0:
        # For modes 0 and 1, shift the project start earlier business-day wise.
        if mode in (0, 1):
            wanted_start_ts = wanted_start_ts - pd.offsets.BDay(abs(diff))
        elif mode == 2:
            pass
        else:
            raise ValueError("Invalid mode value. Must be 0, 1, or 2.")

    # Now, for each task offset (in working days) add the offset using Business Day arithmetic.
    schedule_df['start_date'] = schedule_df['start_date'].apply(
        lambda x: (wanted_start_ts + pd.offsets.BDay(x)).date()
    )
    schedule_df['end_date'] = schedule_df['end_date'].apply(
        lambda x: (wanted_start_ts + pd.offsets.BDay(x)).date()
    )
    return schedule_df, wanted_start_ts.date()


async def calculate_sensible_schedule(
        project_id: int,
        wanted_start: Optional[date],
        wanted_end: Optional[date],
) -> Tuple[pd.DataFrame, date, date, int, bool]:
    """
    Core logic for calculating the sensible schedule.

    Args:
        project_id (int): The ID of the project.
        wanted_start (Optional[date]): The desired start date.
        wanted_end (Optional[date]): The desired end date.

    Returns:
        Tuple containing:
            - adjusted_schedule (pd.DataFrame): The adjusted schedule.
            - adjusted_wanted_start (date): The adjusted start date.
            - wanted_end (date): The end date.
            - end_int (int): The project duration in business days.
            - given_duration_overridden (bool): Whether the given duration was overridden.
    """
    params = {
        "wanted_start": wanted_start,
        "wanted_end": wanted_end,
        "wanted_duration": None  # deprecated, so this has been set to None
    }
    wanted_duration = None  # deprecated, so this has been set to None

    none_count = sum(value is None for value in params.values())
    if none_count != 1:
        raise HTTPException(
            status_code=400,
            detail=f"Exactly two of wanted_start, wanted_end, or wanted_duration must be provided, "
                   f"with the third as null. {3 - none_count} were provided."
        )

    # Make sure any user-provided dates fall on business days.
    if wanted_start is not None:
        wanted_start = adjust_if_weekend(wanted_start)
    if wanted_end is not None:
        wanted_end = adjust_if_weekend(wanted_end)

    # Determine scheduling mode (how the missing parameter is computed) and compute the project duration
    # in business days:
    #
    #   Mode 0: Both wanted_start and wanted_end provided.
    #           (Then we compute the working-days duration between them.)
    #   Mode 1: (wanted_end and wanted_duration provided) so we compute wanted_start
    #   Mode 2: (wanted_start and wanted_duration provided) so we compute wanted_end
    if wanted_duration is None:  # Mode 0: Both dates given.
        computed_duration = business_days_between(wanted_start, wanted_end)
        end_int = computed_duration
        schedule_mode = 0
    elif wanted_start is None:  # Mode 1: wanted_end and duration provided. Compute wanted_start by subtracting business days.
        # Subtract wanted_duration business days from wanted_end.
        wanted_start = (pd.Timestamp(wanted_end) - pd.offsets.BDay(wanted_duration)).date()
        schedule_mode = 1
        end_int = wanted_duration
    elif wanted_end is None:  # Mode 2: wanted_start and duration provided. Compute wanted_end by adding business days.
        wanted_end = (pd.Timestamp(wanted_start) + pd.offsets.BDay(wanted_duration)).date()
        schedule_mode = 2
        end_int = wanted_duration

    # Retrieve the tasks (here we assume data.get_all_project_tasks_cpm is defined elsewhere)
    tasks = await data.get_all_project_tasks_cpm(project_id)
    df = pd.DataFrame(tasks)
    df, cycle_info, critical_path_length = compute_cpm(df, include_dependencies_in_result=True)

    # convert cycle_info (a list of 2-tuples) to a list of objects with keys 'id' and 'project_id'
    cycle_info = [{'id': x[0], 'project_id': x[1]} for x in cycle_info]

    if cycle_info:
        raise HTTPException(
            status_code=500,
            detail="Computing schedule: cyclical dependencies detected."
        )

    # Compare the provided (business-day) project duration with the CPM minimum.
    # (critical_path_length is assumed to be in working days – i.e. the sum of target_days_to_complete on the critical path)
    diff = end_int - critical_path_length
    given_duration_overridden = diff < 0
    if given_duration_overridden:
        # If the user-provided working-day duration isn’t long enough to fit the critical path,
        # then default the project duration to the critical path’s length.
        end_int = critical_path_length

    # Calculate the schedule as “working day offsets.”
    sensible_schedule = schedule_tasks(end_int, df)

    # Convert the offsets to actual calendar dates (using business day arithmetic) for the tasks.
    # If the provided duration was too short, then adjust the project’s start date accordingly.
    adjusted_schedule, adjusted_wanted_start = convert_and_adjust_schedule(
        sensible_schedule, diff, schedule_mode, wanted_start
    )

    return adjusted_schedule, adjusted_wanted_start, wanted_end, end_int, given_duration_overridden
