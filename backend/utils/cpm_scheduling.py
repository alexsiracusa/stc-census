from collections import defaultdict, deque
import pandas as pd


def schedule_tasks(end_date: int, tasks_df: pd.DataFrame) -> pd.DataFrame:
    """
    Schedule tasks using the Spread strategy, distributing non-critical tasks between their
    earliest and latest start times, and ensuring the resulting start and end dates are integers.

    Parameters:
    end_date: int (target duration of the project in days, start is assumed to be 0)
    tasks_df: pandas DataFrame with columns ['id', 'earliest_start', 'earliest_finish',
                                              'latest_start', 'latest_finish', 'slack',
                                              'is_critical', 'dependencies']
        where dependencies are lists of row indices in the DataFrame.

    Returns:
    pandas DataFrame with columns ['task_id', 'start_date', 'end_date']
    """
    # Convert DataFrame to dictionary format and process dependencies.
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
        # Convert dependencies from row indices to task_ids.
        deps_task_ids = [tasks_df.iloc[idx]['id'] for idx in dependencies]
        tasks.append((task_id, es, ee, ls, le, slack, is_critical, deps_task_ids))

    # Preprocess tasks into a dictionary by id.
    task_map = {}
    for t in tasks:
        task_id, es, ee, ls, le, slack, is_critical, deps = t
        duration = ee - es
        task_map[task_id] = {
            'id': task_id,
            'earliest_start': es,
            'earliest_finish': ee,
            'latest_start': ls,
            'latest_finish': le,
            'slack': slack,
            'is_critical': is_critical,
            'dependencies': deps,
            'duration': duration
        }

    # Build successor map and in-degree for topological sort.
    successors = defaultdict(list)
    in_degree = defaultdict(int)
    for t in task_map.values():
        for dep in t['dependencies']:
            successors[dep].append(t['id'])
        in_degree[t['id']] = len(t['dependencies'])

    # Compute topological order.
    topo_order = []
    queue = deque([t_id for t_id in task_map if in_degree[t_id] == 0])
    while queue:
        node = queue.popleft()
        topo_order.append(node)
        for succ in successors[node]:
            in_degree[succ] -= 1
            if in_degree[succ] == 0:
                queue.append(succ)

    # Build reverse dependencies for backward pass.
    reverse_successors = defaultdict(list)
    for t in task_map.values():
        for dep in t['dependencies']:
            reverse_successors[t['id']].append(dep)

    # Compute reverse topological order for backward pass.
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

    # Backward pass to compute new LS and LE based on target_duration (end_date)
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

    # Schedule tasks using Spread strategy.
    schedule = {}

    # Schedule critical tasks at their earliest possible start times.
    critical_tasks = [t_id for t_id in task_map if task_map[t_id]['is_critical']]
    for t_id in critical_tasks:
        t = task_map[t_id]
        start = t['earliest_start']  # Already an integer.
        end = start + t['duration']
        schedule[t_id] = (start, end)

    # Process non-critical tasks in topological order.
    non_critical = [t_id for t_id in topo_order if not task_map[t_id]['is_critical']]
    n = len(non_critical)
    for idx, t_id in enumerate(non_critical):
        t = task_map[t_id]
        # Compute the earliest possible start based on dependencies.
        if not t['dependencies']:
            earliest_start = 0
        else:
            earliest_start = max(schedule[dep][1] for dep in t['dependencies'])

        available_slack = new_LS[t_id] - earliest_start

        # Distribute available slack in discrete integer steps.
        if available_slack <= 0:
            start_time = earliest_start
        else:
            # If more than one task, spread them out using integer multiplication & division.
            if n > 1:
                offset = (available_slack * idx) // (n - 1)
            else:
                offset = 0
            start_time = earliest_start + offset

        start_date = start_time
        end_date_task = start_date + t['duration']
        schedule[t_id] = (start_date, end_date_task)

    # Convert the schedule dictionary into a DataFrame.
    result_data = []
    for t_id, (start, end) in schedule.items():
        result_data.append({
            'task_id': t_id,
            'start_date': start,
            'end_date': end
        })

    return pd.DataFrame(result_data)
