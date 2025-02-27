from fastapi import APIRouter, HTTPException, Response, Depends, status
import asyncpg
from pydantic import BaseModel
from typing import List

from ..database import data, admin


router = APIRouter(
    prefix="/projects",
    tags=["projects"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(admin.get_authenticated_user)],
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


class ProjectIds(BaseModel):
    project_ids: List[int]

@router.delete("/delete")
async def delete_projects(
    response: Response,
    request: ProjectIds
):
    try:
        num_deleted = await data.delete_projects(request.project_ids)
        response.status_code = status.HTTP_200_OK
        return {"num_deleted": num_deleted}

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")
