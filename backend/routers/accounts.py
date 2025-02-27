from fastapi import APIRouter, HTTPException, Response, Depends, status
from ..database import admin
import asyncpg

from ..database import data

router = APIRouter(
    prefix="/accounts",
    tags=["accounts"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(admin.get_authenticated_user)],
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