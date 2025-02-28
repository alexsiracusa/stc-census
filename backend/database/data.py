from fastapi import HTTPException
from .. import client


async def get_accounts():
    return await client.postgres_client.fetch("""
        SELECT id, email, first_name, last_name 
        FROM Account
    """)

async def get_projects():
    return await client.postgres_client.fetch("""
        SELECT * 
        FROM Project_Summary
        WHERE parent IS NULL
    """)

async def delete_projects(project_ids):
    query_parts = [f'id = {project_id}' for project_id in project_ids]

    return await client.postgres_client.fetch(f"""
        WITH deleted AS (
            DELETE FROM Project
            WHERE {' OR '.join(query_parts)}
            RETURNING *
        )
        SELECT count(*) FROM deleted
    """)


async def delete_tasks(task_ids):
    query_parts = [f"(project_id = {task['project_id']} AND id = {task['id']})" for task in task_ids]

    return await client.postgres_client.fetch(f"""
        WITH deleted AS (
            DELETE FROM Task
            WHERE {' OR '.join(query_parts)}
            RETURNING *
        )
        SELECT count(*) FROM deleted
    """)


async def get_project_summary(project_id):
    return await client.postgres_client.fetch_row("""
        SELECT * 
        FROM Project_Summary
        WHERE id = $1
    """, project_id)


async def get_project_by_id(project_id):
    return await client.postgres_client.fetch_row("""
        SELECT *
        FROM Project_Node
        WHERE Project_Node.id = $1
    """, project_id)


# basically, get_project_by_id but recursive to fetch the project and all its descendants
async def get_project_with_descendants(project_id):
    """
    Fetches a project by ID including all of its descendant projects recursively.

    Args:
        project_id: The ID of the top-level project to fetch

    Returns:
        A dictionary containing the project and all its descendants in a nested structure
    """
    return await client.postgres_client.fetch_row("""
        SELECT 
            jsonb_build_object(
                'project', (
                    SELECT row_to_json(p) 
                    FROM (SELECT * FROM Project_Node WHERE id = $1) AS p
                ),
                'descendants', (
                    SELECT COALESCE(jsonb_agg(row_to_json(p)), '[]'::jsonb)
                    FROM (
                        SELECT * 
                        FROM Project_Node
                        WHERE id IN (
                            SELECT unnest(children)
                            FROM Project_Children
                            WHERE id = $1
                        )
                        AND id != $1
                        ORDER BY id
                    ) AS p
                )
            ) AS result
    """, project_id)


async def get_all_project_tasks(project_id):
    return await client.postgres_client.fetch_row("""
        SELECT
            $1::INTEGER AS project_id,
            (SELECT jsonb_agg(row_to_json(t)) FROM (
                SELECT * FROM Task_Node
                WHERE Task_Node.project_id IN (
                    SELECT unnest(children)
                    FROM Project_Children 
                    WHERE id = $1
            )) AS t) AS all_tasks
        """, project_id)


# this is for the cpm algorithm to compute cpm stats
async def get_all_project_tasks_cpm(project_id):
    return await client.postgres_client.fetch("""
        SELECT id, project_id, status, target_days_to_complete, depends_on
        FROM Task_Node
        WHERE Task_Node.project_id IN (
            SELECT unnest(children)
            FROM Project_Children
            WHERE id = $1
        )
    """, project_id)


# for evm
async def get_all_project_tasks_evm(project_id):
    return await client.postgres_client.fetch("""
        SELECT status, actual_cost, expected_cost, actual_start_date,
        target_start_date, actual_completion_date, target_completion_date, target_days_to_complete
        FROM Task_Node
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

            # could do SQL injection with the field string here, fix
            query_parts = [f"{field} = ${i + 1}" for i, field in enumerate(fields.keys())]
            values = list(fields.values()) + [project_id, task_id]

            if len(fields.keys()) != 0:
                result = await con.fetch(f"""
                    UPDATE Task
                    SET {', '.join(query_parts)}
                    WHERE project_id = ${len(values) - 1} AND id = ${len(values)}
                    RETURNING id
                """, *values)

                # If task does not exist or doesn't require updating depends_on, return
                if not result or depends_on is None:
                    return result
            else:
                # ensure the task actually exists before changing dependencies
                result = await con.execute("""
                    SELECT id 
                    FROM Task
                    WHERE project_id = $1 AND id = $2
                """, project_id, task_id)

            # TODO make the rest of this function not shit
            query_parts = []
            values = []

            for index, depends_on in enumerate(depends_on):
                if not isinstance(depends_on, dict) or depends_on.get('task_id') is None or depends_on.get(
                        'project_id') is None:
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
                WHERE project_id = $1 AND task_id = $2
            """, project_id, task_id)

            if len(depends_on) == 0:
                return result

            await con.execute(f"""
                INSERT INTO Task_Depends_On(task_id, project_id, depends_task_id, depends_project_id)
                VALUES {', '.join(query_parts)}
            """, *values)

            return result


async def delete_task(project_id, task_id):
    return await client.postgres_client.fetch(f"""
        DELETE FROM Task
        WHERE project_id = $1 AND id = $2
        RETURNING id
    """, project_id, task_id)


async def update_project(project_id, fields: dict):
    if fields.get('project_id') is not None:
        raise HTTPException(status_code=400, detail="Project id cannot be updated")

    # could do SQL injection with the field string here, fix
    query_parts = [f"{field} = ${i + 1}" for i, field in enumerate(fields.keys())]
    values = list(fields.values()) + [project_id]

    return await client.postgres_client.fetch(f"""
        UPDATE Project
        SET {', '.join(query_parts)}
        WHERE id = ${len(values)}
        RETURNING id
    """, *values)


async def insert_into(table_name, columns, values):
    value_placeholders = [f'${i + 1}' for i in range(len(values))]

    # could do SQL injection with the column names here, fix
    return await client.postgres_client.fetch_row(f"""
        INSERT INTO {table_name} ({', '.join(columns)})
        VALUES ({', '.join(value_placeholders)})
        RETURNING *
    """, *values)


async def create_task(project_id, fields: dict):
    if fields.get('id') is not None:
        raise HTTPException(status_code=400, detail="Task id cannot be specified")

    if fields.get('depends_on') is not None:
        raise HTTPException(status_code=400,
                            detail="Creating a task with dependencies is not supported, please update the task dependencies after creation")

    # could do SQL injection with the field string here, fix
    column_names = ['project_id'] + list(fields.keys())
    column_values = [project_id] + list(fields.values())

    return await insert_into('Task', column_names, column_values)


async def create_project(fields: dict):
    if fields.get('id') is not None:
        raise HTTPException(status_code=400, detail="Project id cannot be specified")

    return await insert_into('Project', list(fields.keys()), list(fields.values()))


# for email notifications
async def get_tasks_due_soon(days_until_due:int=3):
    return await client.postgres_client.fetch(f"""
        SELECT t.id, t.project_id, t.name, t.target_completion_date, 
               task_person.email AS task_person_email, 
               task_person.first_name AS task_person_first_name, 
               task_person.last_name AS task_person_last_name,
               proj_person.email AS project_person_email, 
               proj_person.first_name AS project_person_first_name, 
               proj_person.last_name AS project_person_last_name
        FROM Task t
        JOIN Project p ON t.project_id = p.id
        LEFT JOIN Account task_person ON t.person_in_charge_id = task_person.id
        LEFT JOIN Account proj_person ON p.person_in_charge_id = proj_person.id
        WHERE t.target_completion_date IS NOT NULL
        AND NOW() BETWEEN (t.target_completion_date - INTERVAL '{int(days_until_due*24)} hours')
        AND t.target_completion_date
    """ )


async def get_tasks_overdue():
    return await client.postgres_client.fetch("""
        SELECT t.id, t.project_id, t.name, t.target_completion_date, 
               task_person.email AS task_person_email, 
               task_person.first_name AS task_person_first_name, 
               task_person.last_name AS task_person_last_name,
               proj_person.email AS project_person_email, 
               proj_person.first_name AS project_person_first_name, 
               proj_person.last_name AS project_person_last_name
        FROM Task t
        JOIN Project p ON t.project_id = p.id
        LEFT JOIN Account task_person ON t.person_in_charge_id = task_person.id
        LEFT JOIN Account proj_person ON p.person_in_charge_id = proj_person.id
        WHERE t.target_completion_date IS NOT NULL
        AND NOW() > t.target_completion_date
    """)
