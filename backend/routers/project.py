from fastapi import APIRouter, HTTPException, Response, status, Body
import pandas as pd
import asyncpg
from typing import Any, Optional
from datetime import date

from ..database import data
from .task import router as task_router
from ..utils.cpm import compute_cpm
from ..utils.evm import compute_evm
from ..utils.sensible_scheduling import schedule_tasks, adjust_if_weekend, business_days_between, convert_and_adjust_schedule

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
async def get_sensible_scheduling(project_id: int,
                                  wanted_start: Optional[date] = None,
                                  wanted_end: Optional[date] = None,
                                  wanted_duration: Optional[int] = None,
                                  response: Response = None):
    try:
        params = {
            "wanted_start": wanted_start,
            "wanted_end": wanted_end,
            "wanted_duration": wanted_duration
        }

        none_count = sum(value is None for value in params.values())
        if none_count != 1:
            raise HTTPException(
                status_code=400,
                detail=f"Exactly two of wanted_start, wanted_end, or wanted_duration must be provided, "
                       f"with the third as null. {3 - none_count} were provided."
            )

        # Make sure any user-provided dates fall on business days.
        if wanted_start is not None:
            wanted_start = adjust_if_weekend(wanted_start)
        if wanted_end is not None:
            wanted_end = adjust_if_weekend(wanted_end)

        # Determine scheduling mode (how the missing parameter is computed) and compute the project duration
        # in business days:
        #
        #   Mode 0: Both wanted_start and wanted_end provided.
        #           (Then we compute the working-days duration between them.)
        #   Mode 1: (wanted_end and wanted_duration provided) so we compute wanted_start
        #   Mode 2: (wanted_start and wanted_duration provided) so we compute wanted_end
        if wanted_duration is None:  # Mode 0: Both dates given.
            computed_duration = business_days_between(wanted_start, wanted_end)
            end_int = computed_duration
            schedule_mode = 0
        elif wanted_start is None:  # Mode 1: wanted_end and duration provided. Compute wanted_start by subtracting business days.
            # Subtract wanted_duration business days from wanted_end.
            wanted_start = (pd.Timestamp(wanted_end) - pd.offsets.BDay(wanted_duration)).date()
            schedule_mode = 1
            end_int = wanted_duration
        elif wanted_end is None:  # Mode 2: wanted_start and duration provided. Compute wanted_end by adding business days.
            wanted_end = (pd.Timestamp(wanted_start) + pd.offsets.BDay(wanted_duration)).date()
            schedule_mode = 2
            end_int = wanted_duration

        # Retrieve the tasks (here we assume data.get_all_project_tasks_cpm is defined elsewhere)
        tasks = await data.get_all_project_tasks_cpm(project_id)
        df = pd.DataFrame(tasks)
        df, cycle_info, critical_path_length = compute_cpm(df, include_dependencies_in_result=True)

        # convert cycle_info (a list of 2-tuples) to a list of objects with keys 'id' and 'project_id'
        cycle_info = [{'id': x[0], 'project_id': x[1]} for x in cycle_info]

        if cycle_info:
            raise HTTPException(
                status_code=500,
                detail="Computing schedule: cyclical dependencies detected."
            )

        # Compare the provided (business-day) project duration with the CPM minimum.
        # (critical_path_length is assumed to be in working days – i.e. the sum of target_days_to_complete on the critical path)
        diff = end_int - critical_path_length
        if diff < 0:
            # If the user-provided working-day duration isn’t long enough to fit the critical path,
            # then default the project duration to the critical path’s length.
            end_int = critical_path_length

        # Calculate the schedule as “working day offsets.”
        sensible_schedule = schedule_tasks(end_int, df)

        # Convert the offsets to actual calendar dates (using business day arithmetic) for the tasks.
        # If the provided duration was too short, then adjust the project’s start date accordingly.
        adjusted_schedule, adjusted_wanted_start = convert_and_adjust_schedule(
            sensible_schedule, diff, schedule_mode, wanted_start
        )

        result = {
            "id": project_id,
            "suggested_schedule": adjusted_schedule.to_dict(orient="records"),
            "givenDurationOverridden": str(diff < 0),
            "projectStartDate": adjusted_wanted_start,
            "projectEndDate": wanted_end,
            "projectDurationInDays": int(end_int)
        }
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error with CPM-based scheduling: {str(e)}"
        )


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