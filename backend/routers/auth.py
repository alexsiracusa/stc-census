from fastapi import APIRouter, HTTPException, Response, Request, status
import asyncpg

from ..database import AccountInfo, AccountLogin, InvalidCredentials, admin


# Get TLS certificate from here for deploying
# https://letsencrypt.org/

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)


@router.post("/register/")
async def register(
    request: Request,
    response: Response,
    account: AccountInfo
):
    try:
        session_id, account = await admin.register(account, request.client.host)
        admin.set_session_cookie(response, session_id)
        response.status_code = status.HTTP_201_CREATED
        return account

    except asyncpg.exceptions.PostgresError as error:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": str(error)}


@router.post("/login/")
async def login(
    request: Request,
    response: Response,
    account: AccountLogin
):
    try:
        session_id, account = await admin.login(account, request.client.host)
        admin.set_session_cookie(response, session_id)
        response.status_code = status.HTTP_200_OK
        return account

    except InvalidCredentials as error:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"error": str(error)}

    except asyncpg.exceptions.PostgresError as error:
        response.status_code = status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=500, detail=f"Database error: {str(error)}")


@router.post("/logout/")
async def logout(
    request: Request,
    response: Response,
):
    try:
        session_id = request.session
        if session_id is None:
            InvalidCredentials()

        await admin.logout(session_id)
        admin.set_session_cookie(response, None)

        response.status_code = status.HTTP_200_OK
        return {"message": "Logged out successfully"}

    except InvalidCredentials:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"error": "Invalid or expired session_id"}


@router.get("/ping/")
async def ping(
    request: Request,
    response: Response,
):
    try:
        account_info = request.user
        if account_info is None:
            raise InvalidCredentials()

        response.status_code = status.HTTP_200_OK
        return account_info

    except InvalidCredentials:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"error": "Invalid or expired session_id"}
