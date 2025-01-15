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
            to_json(array_agg(Task.*)) AS tasks,
            to_json(array_agg(DISTINCT Sub_Project.*)) AS sub_projects
        FROM Project 
        INNER JOIN Task ON Task.parent = $1
        INNER JOIN Project AS Sub_Project ON Sub_Project.parent = $1
        WHERE Project.id = $1
        GROUP BY Project.id
    """, project_id)