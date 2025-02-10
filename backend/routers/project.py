from fastapi import APIRouter, HTTPException, Response, status
import pandas as pd
import asyncpg

from ..database import data
from .task import router as task_router
from ..utils.cpm import compute_cpm


router = APIRouter(
    prefix="/project",
    tags=["project"],
    responses={404: {"description": "Not found"}},
)

router.include_router(task_router)


@router.get("/{project_id}")
async def get_project(
    response: Response,
    project_id: int
):
    try:
        project = await data.get_project_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        response.status_code = status.HTTP_200_OK
        return project

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")


@router.get("/{project_id}/summary")
async def get_project(
    response: Response,
    project_id: int
):
    try:
        project = await data.get_project_summary(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        response.status_code = status.HTTP_200_OK
        return project

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")


@router.get("/{project_id}/all-tasks")
async def get_project(
    response: Response,
    project_id: int
):
    try:
        project = await data.get_all_project_tasks(project_id)
        response.status_code = status.HTTP_200_OK
        return project

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")


@router.get("/{project_id}/cpm")
async def get_cpm_analysis(project_id: int, response: Response):
    try:
        # Get all tasks with dependencies for the project
        tasks = await data.get_all_project_tasks_cpm(project_id)
        df = pd.DataFrame(tasks)
        df = compute_cpm(df)
        # Create the final dictionary with the desired structure
        result = {
            "id": project_id,
            "cpm": df.to_dict(orient="records")
        }
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating CPM: {str(e)}"
        )
