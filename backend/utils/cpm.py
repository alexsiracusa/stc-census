import pandas as pd
from collections import deque
import ast

def compute_cpm(df: pd.DataFrame) -> pd.DataFrame:
    df = prepare_data(df)
    # assumption: df contains columns 'target_duration', 'dependencies'
    n = len(df)
    if n == 0:
        return pd.DataFrame(columns=['es', 'ef', 'ls', 'lf', 'slack'])

    # build successors list
    successors = [[] for _ in range(n)]
    for i in df.index:
        for predecessor in df.loc[i, 'dependencies']:
            successors[predecessor].append(i)

    # compute in-degree for each node
    in_degree = df['dependencies'].apply(len).to_numpy()

    # Kahn's algorithm for topological sort
    top_order = []
    queue = deque([i for i in df.index if in_degree[i] == 0])

    while queue:
        node = queue.popleft()
        top_order.append(node)
        for successor in successors[node]:
            in_degree[successor] -= 1
            if in_degree[successor] == 0:
                queue.append(successor)

    # forward pass to compute ES and EF
    es = pd.Series(0, index=df.index)
    ef = pd.Series(0, index=df.index)
    for node in top_order:
        deps = df.loc[node, 'dependencies']
        es[node] = max(ef[p] for p in deps) if deps else 0
        ef[node] = es[node] + df.loc[node, 'target_duration']

    project_duration = ef.max()

    # backward pass to compute LS and LF
    lf = pd.Series(0, index=df.index)
    ls = pd.Series(0, index=df.index)
    for node in reversed(top_order):
        node_successors = successors[node]
        if not node_successors:
            lf[node] = project_duration
        else:
            lf[node] = min(ls[s] for s in node_successors)
        ls[node] = lf[node] - df.loc[node, 'target_duration']

    # compute slack and whether the task is critical
    slack = ls - es
    critical = slack == 0

    result_df = pd.DataFrame({
        'id': df['id'],
        'project_id': df['project_id'],
        'earliest_start': es,
        'earliest_finish': ef,
        'latest_start': ls,
        'latest_finish': lf,
        'slack': slack,
        'critical': critical
    })

    return result_df

# helper function to prepare data
def prepare_data(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = ['id', 'project_id', 'status',
                      'actual_start', 'actual_end',
                      'target_start', 'target_end', 'target_duration', 'dependencies']

    df['target_duration'] = df['target_duration'].astype(float)
    df.loc[df['status'] == 'done', 'target_duration'] = 0  # completed tasks are 'skipped'

    def convert_dependencies(dep_str):
        if dep_str == '[]':
            return []
        dep_list = ast.literal_eval(dep_str)
        return [tuple(d.values()) for d in dep_list]

    df['dependencies'] = df['dependencies'].apply(str).apply(convert_dependencies)

    def convert_to_indices(dep_list):
        id_to_index = df.reset_index().set_index(['id', 'project_id'])['index'].to_dict()
        return [id_to_index.get((id_, proj_id)) for id_, proj_id in dep_list]

    df['dependencies'] = df['dependencies'].apply(convert_to_indices)

    df = df.drop(columns=['status', 'actual_start', 'actual_end', 'target_start', 'target_end'])

    return df
