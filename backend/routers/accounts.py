from fastapi import APIRouter, HTTPException, Response, status
from pydantic import BaseModel
from typing import List
import asyncpg

from ..database import data

router = APIRouter(
    prefix="/accounts",
    tags=["accounts"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
async def get_accounts(
    response: Response
):
    try:
        accounts = await data.get_accounts()
        response.status_code = status.HTTP_200_OK
        return accounts

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")