from fastapi import APIRouter, HTTPException, Response, Body, Depends, status
from typing import Any
from datetime import date
from typing import Optional
import pandas as pd
import asyncpg

from ..database import data, admin
import utils.sensible_scheduling as ss

router = APIRouter(
    prefix="/{project_id}/task",
    tags=["task"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(admin.get_authenticated_user)],
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


@router.put("/use_suggested_schedule")
async def use_suggested_schedule(project_id: int,
                                 wanted_start: Optional[date] = None,
                                 wanted_end: Optional[date] = None,
                                 response: Response = None):
    try:
        # Get scheduled tasks from external source
        schedule_df, _, _, _, _ = await ss.calculate_sensible_schedule(project_id,wanted_start,wanted_end)  # Implement this function

        # Validate DataFrame structure
        required_columns = {'task_id', 'project_id', 'target_start_date', 'target_completion_date'}
        if not required_columns.issubset(set(schedule_df.columns)):
            missing = required_columns - set(schedule_df.columns)
            raise HTTPException(400, f"Missing required columns in schedule data: {missing}")

        # Convert DataFrame to batch update format
        tasks_to_update = []
        for _, row in schedule_df.iterrows():
            task_update = {
                "task_id": row['task_id'],
                "project_id": row['project_id'],
                "fields": {
                    "target_start_date": row['target_start_date'].isoformat() if pd.notnull(
                        row['target_start_date']) else None,
                    "target_completion_date": row['target_completion_date'].isoformat() if pd.notnull(
                        row['target_completion_date']) else None
                }
            }
            tasks_to_update.append(task_update)

        # Perform batch update
        update_result = await data.update_tasks(tasks_to_update)

        response.status_code = status.HTTP_200_OK
        return {
            "message": f"Updated schedule for {update_result['updated_tasks']} tasks",
            "updated_projects": list(schedule_df['project_id'].unique())
        }

    except HTTPException as he:
        raise he
    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(500, f"Database error: {str(error)}")
    except Exception as e:
        raise HTTPException(500, f"Schedule update failed: {str(e)}")


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
