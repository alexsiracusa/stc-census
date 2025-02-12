from collections import defaultdict, deque
import pandas as pd

def schedule_tasks(tasks_df, target_start_date, target_duration, toggle):
    """
    Schedule tasks based on different strategies (ASAP, ALAP, or Spread).

    Parameters:
    tasks_df: pandas DataFrame with columns ['task_id', 'es', 'ee', 'ls', 'le', 'slack', 'deps']
        where deps should be a list of task_ids
    target_start_date: float or int
    target_duration: float or int
    toggle: int (1 for ASAP, 2 for ALAP, 3 for Spread)

    Returns:
    pandas DataFrame with columns ['task_id', 'start_date', 'end_date']
    """
    # Convert DataFrame to dictionary format for processing
    tasks = tasks_df.to_dict('records')
    tasks = [(row['task_id'], row['es'], row['ee'], row['ls'],
              row['le'], row['slack'], row['deps']) for row in tasks]

    # Preprocess tasks into a dictionary by id
    task_map = {}
    for t in tasks:
        task_id, es, ee, ls, le, slack, deps = t
        duration = ee - es
        task_map[task_id] = {
            'id': task_id,
            'es': es,
            'ee': ee,
            'ls': ls,
            'le': le,
            'slack': slack,
            'deps': deps,
            'duration': duration
        }

    original_duration = max(t['ee'] for t in task_map.values())
    if toggle in [2, 3] and target_duration < original_duration:
        raise ValueError("Target duration is shorter than original project duration")

    # Build successor map and in-degree for topological sort
    successors = defaultdict(list)
    in_degree = defaultdict(int)
    for t in task_map.values():
        for dep in t['deps']:
            successors[dep].append(t['id'])
        in_degree[t['id']] = len(t['deps'])

    # Compute topological order for ASAP and Spread
    topo_order = []
    queue = deque([t_id for t_id in task_map if in_degree[t_id] == 0])
    while queue:
        node = queue.popleft()
        topo_order.append(node)
        for succ in successors[node]:
            in_degree[succ] -= 1
            if in_degree[succ] == 0:
                queue.append(succ)

    # Compute new LS and LE for ALAP and Spread if needed
    new_LS = {}
    new_LE = {}
    if toggle in [2, 3]:
        # Build reverse dependencies for backward pass
        reverse_successors = defaultdict(list)
        for t in task_map.values():
            for dep in t['deps']:
                reverse_successors[t['id']].append(dep)

        # Compute reverse topological order for backward pass
        reverse_topo_order = []
        pred_counts = defaultdict(int)
        for t in task_map.values():
            for dep in t['deps']:
                pred_counts[dep] += 1

        rev_queue = deque([t_id for t_id in task_map if len(successors[t_id]) == 0])
        while rev_queue:
            node = rev_queue.popleft()
            reverse_topo_order.append(node)
            for pred in reverse_successors.get(node, []):
                pred_counts[pred] -= 1
                if pred_counts[pred] == 0:
                    rev_queue.append(pred)

        # Backward pass to compute new LS and LE
        for t_id in reversed(reverse_topo_order):
            t = task_map[t_id]
            if len(successors[t_id]) == 0:
                new_LE[t_id] = target_duration
            else:
                new_LE[t_id] = min(new_LS[succ] for succ in successors[t_id])
            new_LS[t_id] = new_LE[t_id] - t['duration']

    # Schedule based on toggle
    schedule = {}
    if toggle == 1:  # ASAP
        for t_id in task_map:
            t = task_map[t_id]
            start = target_start_date + t['es']
            end = target_start_date + t['ee']
            schedule[t_id] = (start, end)
    elif toggle == 2:  # ALAP
        for t_id in task_map:
            t = task_map[t_id]
            start = target_start_date + new_LS[t_id]
            end = target_start_date + new_LE[t_id]
            schedule[t_id] = (start, end)
    elif toggle == 3:  # Spread out
        # Schedule critical tasks ASAP
        critical_tasks = [t_id for t_id in task_map if task_map[t_id]['slack'] == 0]
        for t_id in critical_tasks:
            t = task_map[t_id]
            start = target_start_date + t['es']
            end = start + t['duration']
            schedule[t_id] = (start, end)

        # Process non-critical in topological order
        non_critical = [t_id for t_id in topo_order if task_map[t_id]['slack'] > 0]
        n = len(non_critical)
        for idx, t_id in enumerate(non_critical):
            t = task_map[t_id]
            # Compute earliest possible start based on dependencies
            if not t['deps']:
                earliest_start = 0.0
            else:
                earliest_start = max(schedule[dep][1] - target_start_date for dep in t['deps'])
            available_slack = new_LS[t_id] - earliest_start
            if available_slack <= 0:
                start_time = earliest_start
            else:
                if n > 1:
                    alpha = idx / (n - 1)
                else:
                    alpha = 0.0
                start_time = earliest_start + available_slack * alpha
            start_date = target_start_date + start_time
            end_date = start_date + t['duration']
            schedule[t_id] = (start_date, end_date)
    else:
        raise ValueError("Invalid toggle value")

    # Convert schedule to DataFrame
    result_data = []
    for t_id, (start, end) in schedule.items():
        result_data.append({
            'task_id': t_id,
            'start_date': start,
            'end_date': end
        })

    return pd.DataFrame(result_data)
