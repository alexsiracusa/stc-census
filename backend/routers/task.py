from fastapi import APIRouter, HTTPException, Response, Body, status
from typing import Any
import asyncpg

from ..database import data

router = APIRouter(
    prefix="/{project_id}/task",
    tags=["task"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{task_id}/")
async def get_task(
    response: Response,
    project_id: int,
    task_id: int,
):
    try:
        task = await data.get_task(project_id, task_id)
        response.status_code = status.HTTP_200_OK
        return task

    except Exception as error:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(error)}


@router.put("/{task_id}/update")
async def update_task(
    response: Response,
    project_id: int,
    task_id: int,
    fields: Any = Body(None)
):
    try:
        updated_task = await data.update_task(project_id, task_id, fields)

        if not updated_task:
            raise HTTPException(status_code=404, detail="Task not found")

        response.status_code = status.HTTP_200_OK
        return {'message': "task updated successfully"}

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")


@router.post("/create")
async def create_task(
    response: Response,
    project_id: int,
    fields: Any = Body(None)
):
    try:
        task = await data.create_task(project_id, fields)
        task = await data.get_task(project_id, task['id'])
        response.status_code = status.HTTP_200_OK
        return task

    except Exception as error:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(error)}


@router.delete("/{task_id}/delete")
async def delete_task(
    response: Response,
    project_id: int,
    task_id: int,
):
    try:
        task = await data.delete_task(project_id, task_id)

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        response.status_code = status.HTTP_200_OK
        return {'message': "task deleted successfully"}

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")
