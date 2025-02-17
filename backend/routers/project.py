from fastapi import APIRouter, HTTPException, Response, status, Body
import pandas as pd
import asyncpg
from typing import Any
import json

from ..database import data
from .task import router as task_router
from ..utils.cpm import compute_cpm
from ..utils.evm import compute_evm
from ..utils.es import compute_es
from ..utils.cpm_scheduling import schedule_tasks

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


@router.put("/{project_id}/update")
async def get_project(
    response: Response,
    project_id: int,
    fields: Any = Body(None)
):
    try:
        project = await data.update_project(project_id, fields)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        response.status_code = status.HTTP_200_OK
        return project

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")


@router.post("/create")
async def get_task(
        response: Response,
        fields: Any = Body(None)
):
    try:
        if isinstance(fields, bytes):
            fields = json.loads(fields.decode("utf-8"))

        task = await data.create_project(fields)
        response.status_code = status.HTTP_200_OK
        return task

    except Exception as error:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(error)}


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
        df, cycle_info, critical_path_length = compute_cpm(df)

        # convert cycle_info (a list of 2-tuple) to a list of objects with keys 'id' and 'project_id'
        cycle_info = [{'id': x[0], 'project_id': x[1]} for x in cycle_info]

        # sensible_schedule = schedule_tasks(df, )

        # Create the final dictionary with the desired structure
        result = {
            "id": project_id,
            "cpm": df.to_dict(orient="records"),
            "cycleInfo": cycle_info,
            "criticalPathLength": float(critical_path_length)
        }
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating CPM: {str(e)}"
        )


@router.get("/{project_id}/evm")
async def get_evm_analysis(project_id: int, response: Response):
    try:
        # Get all tasks for the project
        tasks = await data.get_all_project_tasks_evm(project_id)
        df = pd.DataFrame(tasks)
        df = compute_evm(df)
        # Create the final dictionary with the desired structure
        result = {
            "id": project_id,
            "evm": df.to_dict(orient="records")
        }
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating EVM: {str(e)}"
        )


@router.get("/{project_id}/es")
async def get_es_analysis(project_id: int, response: Response):
    try:
        # Get all tasks for the project
        tasks = await data.get_all_project_tasks_evm(project_id)
        df = pd.DataFrame(tasks)
        df = compute_es(df)
        # Create the final dictionary with the desired structure
        result = {
            "id": project_id,
            "es": df.to_dict(orient="records")
        }
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating EVM: {str(e)}"
        )
