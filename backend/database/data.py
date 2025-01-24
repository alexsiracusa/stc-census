import backend.client as client


async def get_projects():
    return await client.postgres_client.fetch("""
        SELECT * 
        FROM Project
        WHERE parent IS NULL
    """)


async def get_project_by_id(project_id):
    return await client.postgres_client.fetch_row("""
        SELECT 
            Project.*,
            to_json(array_remove(array_agg(Task_Node.*), NULL)) AS tasks,
            to_json(array_remove(array_agg(DISTINCT Sub_Project.*), NULL)) AS sub_projects,
            (SELECT path FROM Project_Path WHERE id = $1) AS path
        FROM Project 
        LEFT JOIN Task_Node ON Task_Node.parent = $1
        LEFT JOIN Project AS Sub_Project ON Sub_Project.parent = $1
        WHERE Project.id = $1
        GROUP BY Project.id
    """, project_id)


async def get_all_project_tasks(project_id):
    return await client.postgres_client.fetch("""
        SELECT * FROM Task_Node
        WHERE Task_Node.parent IN (
            SELECT unnest(children)
            FROM Project_Children 
            WHERE id = $1
        )
    """, project_id)


async def get_task(task_id):
    return await client.postgres_client.fetch_row(f"""
        SELECT * FROM Task_Node WHERE id = $1
     """, task_id)


async def update_task(task_id, fields):
    query_parts = []
    values = []

    for idx, (field, value) in enumerate(fields.items()):
        query_parts.append(f"{field} = ${idx + 1}")
        values.append(value)

    values.append(task_id)

    return await client.postgres_client.execute(f"""
        UPDATE Task
        SET {', '.join(query_parts)}
        WHERE id = ${len(values)}
    """, *values)

