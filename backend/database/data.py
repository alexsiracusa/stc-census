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
            Project.id, Project.name,
            JSON_AGG(json_build_object(
                'id', Task.id, 
                'name', Task.name,
                'status', Task.status
            )) AS tasks
        FROM Project 
        INNER JOIN Task ON Task.parent = $1
        WHERE Project.id = $1
        GROUP BY Project.id
    """, project_id)