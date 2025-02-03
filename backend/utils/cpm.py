import pandas as pd
from collections import deque

def compute_cpm(tasks):
    df = pd.DataFrame(tasks)
    df["du"] = df["du"].fillna(0)

    # Add End node
    terminal_tasks = df[~df["ac"].isin(df["pr"].str.split(",").explode().dropna())]
    end_predecessors = ",".join(terminal_tasks["ac"]) if not terminal_tasks.empty else "-"
    df = pd.concat([df, pd.DataFrame([{
        "ac": "End",
        "pr": end_predecessors,
        "du": 0
    }])], ignore_index=True)

    # Create mappings
    task_to_idx = {task: i for i, task in enumerate(df["ac"])}
    idx_to_task = {i: task for task, i in task_to_idx.items()}

    # Build graph
    graph = [[] for _ in range(len(df))]
    for _, row in df.iterrows():
        if row["pr"] != "-":
            for predecessor in row["pr"].split(","):
                graph[task_to_idx[predecessor]].append(task_to_idx[row["ac"]])

    # Topological sort
    in_degree = [0] * len(graph)
    for u in range(len(graph)):
        for v in graph[u]:
            in_degree[v] += 1

    queue = deque([u for u in range(len(graph)) if in_degree[u] == 0])
    topo_order = []

    while queue:
        u = queue.popleft()
        topo_order.append(u)
        for v in graph[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    # Forward pass
    es, ef = [0] * len(df), [0] * len(df)
    for u in topo_order:
        if df.iloc[u]["pr"] != "-":
            es[u] = max(ef[task_to_idx[p]] for p in df.iloc[u]["pr"].split(","))
        ef[u] = es[u] + df.iloc[u]["du"]

    # Backward pass
    lf, ls = [ef[-1]] * len(df), [0] * len(df)
    for u in reversed(topo_order):
        if graph[u]:
            lf[u] = min(ls[v] for v in graph[u])
        ls[u] = lf[u] - df.iloc[u]["du"]

    # Create results
    results = []
    for i in range(len(df)):
        if df.iloc[i]["ac"] == "End":
            continue
        results.append({
            "task_id": int(df.iloc[i]["ac"]),
            "es": es[i],
            "ef": ef[i],
            "ls": ls[i],
            "lf": lf[i],
            "slack": lf[i] - ef[i],
            "critical": (lf[i] - ef[i]) == 0
        })

    return pd.DataFrame(results)