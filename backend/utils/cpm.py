import pandas as pd
from collections import deque
import ast

def compute_cpm(df: pd.DataFrame, include_dependencies_in_result:bool=False) -> tuple:
    df = prepare_data(df)
    n = len(df)
    if n == 0:
        # Return an empty dataframe with the proper columns, an empty cycle list, and a critical path duration of 0.
        empty_df = pd.DataFrame(columns=[
            'id', 'project_id', 'earliest_start', 'earliest_finish',
            'latest_start', 'latest_finish', 'slack', 'is_critical', 'dependencies'
        ])
        return empty_df, [], 0

    # Build successors list
    successors = [[] for _ in range(n)]
    for i in df.index:
        for predecessor in df.loc[i, 'dependencies']:
            successors[predecessor].append(i)

    # Find SCCs using Tarjan's algorithm
    sccs = tarjans_scc(successors)

    # Determine cycle nodes
    cycle_nodes = []
    for scc in sccs:
        if len(scc) > 1:
            cycle_nodes.extend(scc)
        else:
            node = scc[0]
            # Self-dependency check
            if node in df.loc[node, 'dependencies']:
                cycle_nodes.append(node)

    # Convert indices to (id, project_id) tuples for cycle nodes
    cycle_node_info = []
    for idx in cycle_nodes:
        cycle_node_info.append((int(df.loc[idx, 'id']),
                                int(df.loc[idx, 'project_id'])))

    # Kahn's algorithm for topological sort
    in_degree = df['dependencies'].apply(len).to_numpy()
    top_order = []
    queue = deque([i for i in df.index if in_degree[i] == 0])

    while queue:
        node = queue.popleft()
        top_order.append(node)
        for successor in successors[node]:
            in_degree[successor] -= 1
            if in_degree[successor] == 0:
                queue.append(successor)

    # Forward pass to compute earliest start (es) and earliest finish (ef)
    es = pd.Series(0, index=df.index)
    ef = pd.Series(0, index=df.index)
    for node in top_order:
        deps = df.loc[node, 'dependencies']
        es[node] = max((ef[p] for p in deps), default=0) if deps else 0
        ef[node] = es[node] + df.loc[node, 'target_duration']

    project_duration = ef.max()

    # Backward pass to compute latest finish (lf) and latest start (ls)
    lf = pd.Series(0, index=df.index)
    ls = pd.Series(0, index=df.index)
    for node in reversed(top_order):
        node_successors = successors[node]
        if not node_successors:
            lf[node] = project_duration
        else:
            lf[node] = min(ls[s] for s in node_successors)
        ls[node] = lf[node] - df.loc[node, 'target_duration']

    # Compute slack and indicate whether the task is on the critical path
    slack = ls - es
    critical = slack == 0

    result_df = pd.DataFrame({
        'id': df['id'],
        'project_id': df['project_id'],
        'target_days_to_complete': df['target_duration'],
        'earliest_start': es,
        'earliest_finish': ef,
        'latest_start': ls,
        'latest_finish': lf,
        'slack': slack,
        'is_critical': critical,
    })

    if include_dependencies_in_result:
        result_df['dependencies'] = df['dependencies']

    return result_df, cycle_node_info, project_duration

def prepare_data(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = ['id', 'project_id', 'status', 'target_duration', 'dependencies']
    # Set any null target_duration to 0
    df['target_duration'] = df['target_duration'].fillna(0)
    df['target_duration'] = df['target_duration'].astype(float)
    df.loc[df['status'] == 'done', 'target_duration'] = 0  # Completed tasks are 'skipped'

    def convert_dependencies(dep_str):
        if dep_str == '[]':
            return []
        dep_list = ast.literal_eval(dep_str)
        return [tuple(d.values()) for d in dep_list]

    df['dependencies'] = df['dependencies'].apply(str).apply(convert_dependencies)

    id_to_index = df.reset_index().set_index(['id', 'project_id'])['index'].to_dict()

    def convert_to_indices(dep_list):
        return [id_to_index.get((id_, proj_id)) for id_, proj_id in dep_list]

    df['dependencies'] = df['dependencies'].apply(convert_to_indices)

    df = df.drop(columns=['status'])
    df = df.reset_index(drop=True)  # Ensure 0-based index

    return df

def tarjans_scc(graph):
    index = 0
    indices = {}
    low = {}
    on_stack = set()
    stack = []
    sccs = []

    def strongconnect(v):
        nonlocal index
        indices[v] = index
        low[v] = index
        index += 1
        stack.append(v)
        on_stack.add(v)
        for w in graph[v]:
            if w not in indices:
                strongconnect(w)
                low[v] = min(low[v], low[w])
            elif w in on_stack:
                low[v] = min(low[v], indices[w])
        if low[v] == indices[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack.remove(w)
                scc.append(w)
                if w == v:
                    break
            sccs.append(scc)

    for v in range(len(graph)):
        if v not in indices:
            strongconnect(v)
    return sccs
