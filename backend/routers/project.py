from fastapi import APIRouter, HTTPException, Response, status, Body, Depends
from typing import Optional, Any, Tuple
from datetime import date
import pandas as pd
import asyncpg

from ..database import data, admin
from .task import router as task_router
from ..utils.cpm import compute_cpm
from ..utils.evm import compute_evm
from ..utils.sensible_scheduling import (schedule_tasks, adjust_if_weekend,
                                         business_days_between, convert_and_adjust_schedule,
                                         calculate_sensible_schedule)

router = APIRouter(
    prefix="/project",
    tags=["project"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(admin.get_authenticated_user)],
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


@router.get("/{project_id}/with-descendants")
async def get_project_with_descendants_endpoint(
        response: Response,
        project_id: int
):
    """
    Retrieves a project by ID along with all its descendant projects in a hierarchical structure.

    Args:
        response: FastAPI Response object
        project_id: The ID of the top-level project to fetch

    Returns:
        A JSON object containing the project and all its descendants
    """
    try:
        result = await data.get_project_with_descendants(project_id)

        if not result:
            raise HTTPException(status_code=404, detail="Project not found")

        response.status_code = status.HTTP_200_OK
        return result

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")


@router.put("/{project_id}/update")
async def update_project(
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
async def create(
        response: Response,
        fields: Any = Body(None)
):
    try:
        project = await data.create_project(fields)
        project = await data.get_project_summary(project['id'])
        response.status_code = status.HTTP_200_OK
        return project

    except Exception as error:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(error)}


@router.get("/{project_id}/summary")
async def get_project_summary(
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
async def get_project_all_tasks(
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
        # check if project exists first
        project = await data.get_project_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project does not exist."
            )

        # Get all tasks with dependencies for the project
        tasks = await data.get_all_project_tasks_cpm(project_id)
        df = pd.DataFrame(tasks)

        # if df is null
        if df.empty:
            raise HTTPException(
                status_code=404,
                detail="Project exists, but has no tasks."
            )
        df, cycle_info, critical_path_length = compute_cpm(df)

        # convert cycle_info (a list of 2-tuple) to a list of objects with keys 'id' and 'project_id'
        cycle_info = [{'id': x[0], 'project_id': x[1]} for x in cycle_info]

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


@router.get("/{project_id}/sensible_scheduling")
async def get_sensible_scheduling(
    project_id: int,
    wanted_start: Optional[date] = None,
    wanted_end: Optional[date] = None,
):
    try:
        # Call the abstracted function to calculate the sensible schedule
        adjusted_schedule, adjusted_wanted_start, wanted_end, end_int, given_duration_overridden = await calculate_sensible_schedule(
            project_id, wanted_start, wanted_end
        )

        # Prepare the result
        result = {
            "id": project_id,
            "givenDurationOverridden": str(given_duration_overridden),
            "projectStartDate": adjusted_wanted_start,
            "projectEndDate": wanted_end,
            "projectDurationInDays": int(end_int),
            "suggested_schedule": adjusted_schedule.to_dict(orient="records"),
        }
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error with CPM-based scheduling: {str(e)}"
        )


@router.put("/{project_id}/use_suggested_schedule")
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


@router.get("/{project_id}/evm")
async def get_evm_analysis(project_id: int, response: Response):
    try:
        # check if project exists first
        project = await data.get_project_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project does not exist."
            )

        # Get all tasks for the project
        tasks = await data.get_all_project_tasks_evm(project_id)
        df = pd.DataFrame(tasks)

        # if df is null
        if df.empty:
            raise HTTPException(
                status_code=404,
                detail="Project exists, but has no tasks."
            )

        evm_data = compute_evm(df)
        # Create the final dictionary with the desired structure
        result = {
            "id": project_id,
            "evm": evm_data # df.to_dict(orient="records")
        }
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating EVM: {str(e)}"
        )
