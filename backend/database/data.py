import backend.client as client
from fastapi import HTTPException


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
        LEFT JOIN Task_Node ON Task_Node.project_id = $1
        LEFT JOIN Project AS Sub_Project ON Sub_Project.parent = $1
        WHERE Project.id = $1
        GROUP BY Project.id
    """, project_id)


async def get_all_project_tasks(project_id):
    return await client.postgres_client.fetch("""
        SELECT * FROM Task_Node
        WHERE Task_Node.project_id IN (
            SELECT unnest(children)
            FROM Project_Children 
            WHERE id = $1
        )
    """, project_id)


async def get_task(project_id, task_id):
    return await client.postgres_client.fetch_row(f"""
        SELECT * FROM Task_Node WHERE project_id = $1 AND id = $2
     """, project_id, task_id)


async def update_task(project_id, task_id, fields: dict):
    if fields.get('id') is not None:
        raise HTTPException(status_code=400, detail="Task id cannot be updated")

    depends_on = fields.pop('depends_on', None)

    async with await client.postgres_client.get_con() as con:
        async with con.transaction():

            query_parts = [f"{field} = ${i + 1}" for i, field in enumerate(fields.keys())]
            values = list(fields.values()) + [project_id, task_id]

            result = await con.fetch(f"""
                UPDATE Task
                SET {', '.join(query_parts)}
                WHERE project_id = ${len(values) - 1} AND id = ${len(values)}
                RETURNING id
            """, *values)

            # If task does not exist or doesn't require updating depends_on, return
            if not result or depends_on is None:
                return result

            # TODO make the rest of this function not shit
            query_parts = []
            values = []

            for index, depends_on in enumerate(depends_on):
                if not isinstance(depends_on, dict) or depends_on.get('task_id') is None or depends_on.get('project_id') is None:
                    raise HTTPException(
                        status_code=400,
                        detail="depends on must include 'task_id': int and 'project_id': int"
                    )

                start = index * 4
                query_parts.append(f"(${start + 1}, ${start + 2}, ${start + 3}, ${start + 4})")
                values.extend([
                    task_id, project_id,
                    depends_on['task_id'], depends_on['project_id']
                ])

            await con.execute("""
                DELETE FROM Task_Depends_On
                WHERE task_id = $1
            """, task_id)

            if len(depends_on) == 0:
                return result

            await con.execute(f"""
                INSERT INTO Task_Depends_On(task_id, project_id, depends_task_id, depends_project_id)
                VALUES {', '.join(query_parts)}
            """, *values)

            return result

