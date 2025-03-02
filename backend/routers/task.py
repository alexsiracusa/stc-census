from fastapi import APIRouter, HTTPException, Response, Body, Depends, status
from typing import Any
from datetime import date
import pandas as pd
import asyncpg

from ..database import data, admin
from ..utils.sensible_scheduling import calculate_sensible_schedule

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
async def use_suggested_schedule(
    project_id: int,
    response: Response,
    wanted_start: date = None,
    wanted_end: date = None
):
    try:
        # Get scheduled tasks from external source
        schedule_df, _, _, _, _ = await calculate_sensible_schedule(project_id, wanted_start, wanted_end)  # Implement this function

        # Validate DataFrame structure
        print(schedule_df.columns)
        required_columns = {'task_id', 'project_id', 'start_date', 'end_date'}
        if not required_columns.issubset(set(schedule_df.columns)):
            missing = required_columns - set(schedule_df.columns)
            raise HTTPException(400, f"Missing required columns in schedule data: {missing}")

        # Convert DataFrame to batch update format
        tasks_to_update = []
        for _, row in schedule_df.iterrows():
            task_update = {
                "task_id": int(row['task_id']),  # Convert numpy.int64 to int
                "project_id": int(row['project_id']),  # Convert numpy.int64 to int
                "fields": {
                    "target_start_date": row['start_date'].isoformat() if pd.notnull(row['start_date']) else None,
                    "target_completion_date": row['end_date'].isoformat() if pd.notnull(row['end_date']) else None
                }
            }
            tasks_to_update.append(task_update)

        # Perform batch update
        update_result = await data.update_tasks(project_id, tasks_to_update)

        response.status_code = status.HTTP_200_OK
        return {
            "message": f"Updated schedule for {int(update_result['updated_tasks'])} tasks",  # Convert numpy.int64 to int
            "updated_projects": [int(proj_id) for proj_id in schedule_df['project_id'].unique()]  # Convert numpy.int64 to int
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
