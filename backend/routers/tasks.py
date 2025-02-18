from fastapi import APIRouter, HTTPException, Response, status
from pydantic import BaseModel
from typing import List
import asyncpg

from ..database import data

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
    responses={404: {"description": "Not found"}},
)


class TaskIds(BaseModel):
    task_ids: List[dict]

@router.delete("/delete")
async def delete_tasks(
    response: Response,
    request: TaskIds
):
    try:
        tasks = await data.delete_tasks(request.task_ids)
        response.status_code = status.HTTP_200_OK
        return tasks

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")