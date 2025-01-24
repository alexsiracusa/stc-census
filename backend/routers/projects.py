from fastapi import APIRouter, HTTPException, Response, status
from ..database import data
import asyncpg

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def get_projects(
    response: Response,
):
    try:
        projects = await data.get_projects()
        response.status_code = status.HTTP_200_OK
        return projects

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")
