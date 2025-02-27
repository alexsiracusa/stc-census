from fastapi import APIRouter, HTTPException, Response, Depends, status
from pydantic import BaseModel
from typing import List
import asyncpg

from ..database import data, admin

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(admin.get_authenticated_user)],
)


class TaskIds(BaseModel):
    task_ids: List[dict]

@router.delete("/delete")
async def delete_tasks(
    response: Response,
    request: TaskIds
):
    try:
        num_deleted = await data.delete_tasks(request.task_ids)
        response.status_code = status.HTTP_200_OK
        return {"num_deleted": num_deleted}

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")