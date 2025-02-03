from fastapi import APIRouter, HTTPException, Response, status
from ..database import data
from .task import router as task_router
from ..utils.cpm import compute_cpm
import pandas as pd
import asyncpg

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
        tasks = await data.get_all_project_tasks_with_dependencies(project_id)

        # Convert to CPM input format
        cpm_input = []
        for task in tasks:
            # Get predecessors from same project
            predecessors = [
                str(dep["task_id"])
                for dep in task["depends_on"]
                if dep["project_id"] == project_id
            ]
            cpm_input.append({
                "ac": str(task["id"]),
                "pr": ",".join(predecessors) if predecessors else "-",
                "du": task["target_days_to_complete"] or 0
            })

        # Compute CPM
        df = compute_cpm(cpm_input)
        return df.to_dict(orient="records")

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating CPM: {str(e)}"
        )