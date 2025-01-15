import backend.client as client

async def get_projects():
    return await client.postgres_client.fetch("""
        SELECT * 
        FROM Project
        WHERE parent IS NULL
    """)