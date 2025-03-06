from fastapi import APIRouter, HTTPException, Response, Body, Depends, status
from ..database import admin
from typing import Any
import asyncpg


router = APIRouter(
    prefix="/account",
    tags=["account"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(admin.get_admin_user)],
)


@router.put("/{account_id}/update/")
async def get_accounts(
    response: Response,
    account_id: int,
    fields: Any = Body(None)
):
    try:
        account = await admin.update_account(account_id, fields)
        response.status_code = status.HTTP_200_OK
        return account

    except asyncpg.exceptions.PostgresError as error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")