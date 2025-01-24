from fastapi import APIRouter, Response, Body, status
from typing import Any
from ..database import data

router = APIRouter(
    prefix="/task",
    tags=["task"],
    responses={404: {"description": "Not found"}},
)

@router.get("/{task_id}/")
async def get_task(
    response: Response,
    task_id: int,
):
    try:
        task =  await data.get_task(task_id)
        response.status_code = status.HTTP_200_OK
        return task

    except Exception as error:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(error)}


@router.put("/{task_id}/update")
async def update_task(
    response: Response,
    task_id: int,
    fields: Any = Body(None)
):
    try:
        await data.update_task(task_id, fields)
        response.status_code = status.HTTP_200_OK
        return {'message': 'update successful'}

    except Exception as error:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(error)}