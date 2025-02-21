from typing import Optional
from datetime import date
import numpy as np
import pandas as pd
from collections import defaultdict, deque


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
