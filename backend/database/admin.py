from pydantic import BaseModel
from fastapi import Request, HTTPException
from datetime import datetime, timedelta, timezone
import uuid

from ..database.exceptions import InvalidCredentials
from .. import client
from . import util


# https://medium.com/@marcnealer/fastapi-http-authentication-f1bb2e8c3433


class AccountInfo(BaseModel):
    email: str
    first_name: str
    last_name: str
    password: str


class AccountLogin(BaseModel):
    email: str
    password: str


async def _create_session(account_id: int, host):
    session_id = str(uuid.uuid4())
    session_hash = util.hash_sha3_256(session_id)
    session_start = datetime.now(timezone.utc)
    expires_at = session_start + timedelta(hours=168)
    last_activity = session_start
    timout_duration = timedelta(hours=48)

    await client.postgres_client.fetch_row("""
        INSERT INTO Session (id, ip_address, account_id, session_start, expires_at, last_activity, timeout_duration)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    """, session_hash, host, account_id, session_start, expires_at, last_activity, timout_duration)

    return session_id


async def register(account: AccountInfo, host):
    # hash password
    password_hash = util.hash_bcrypt_2b(account.password)

    record = await client.postgres_client.fetch_row("""
        INSERT INTO Account (email, first_name, last_name, password_hash) 
        VALUES ($1, $2, $3, $4) RETURNING id;
    """, account.email, account.first_name, account.last_name, password_hash)

    account_id = record.get("id")
    return await _create_session(account_id, host), {
        "id": account_id,
        "email": account.email,
        "first_name": account.first_name,
        "last_name": account.last_name,
        "admin": False
    }


async def login(account: AccountLogin, host):
    # get stored hash value from database
    record = await client.postgres_client.fetch_row("""
        SELECT id, email, first_name, last_name, admin, password_hash 
        FROM Account 
        WHERE lower(email)=lower($1)
    """, account.email)

    # check if account exists
    if record is None:
        raise InvalidCredentials()

    # validate password
    password_hash = record.get('password_hash')
    password_correct = util.check_password(account.password, password_hash)

    if not password_correct:
        raise InvalidCredentials()

    return await _create_session(record.get("id"), host), {
        "id": record.get('id'),
        "email": record.get('email'),
        "first_name": record.get('first_name'),
        "last_name": record.get('last_name'),
        "admin": record.get('admin')
    }


async def logout(session_id):
    session_id_hash = util.hash_sha3_256(session_id)

    await client.postgres_client.execute("""
        DELETE FROM Session
        WHERE id = $1
    """, session_id_hash)


async def update_account(account_id: int, fields: dict):
    if fields.get('id') is not None:
        raise HTTPException(status_code=400, detail="Account id cannot be updated")

    valid_columns = ['email', 'first_name', 'last_name', 'password', 'admin']
    if not all(key in valid_columns for key in fields):
        raise HTTPException(status_code=400, detail="Invalid field specified")

    if fields.get('password') is not None:
        fields['password_hash'] = util.hash_bcrypt_2b(fields.get('password'))
        del fields['password']

    query_parts = [f"{field} = ${i + 1}" for i, field in enumerate(fields.keys())]
    values = list(fields.values()) + [account_id]

    return await client.postgres_client.fetch_row(f"""
        UPDATE Account
        SET {', '.join(query_parts)}
        WHERE id = ${len(values)}
        RETURNING id, email, first_name, last_name, admin
     """, *values)


async def authenticate(request: Request):
    session_id = request.cookies.get('session_id')
    if not session_id:
        raise InvalidCredentials()

    session_id_hash = util.hash_sha3_256(session_id)

    account_info = await client.postgres_client.fetch_row("""
        WITH Account_Session AS (
            UPDATE Session SET last_activity = CURRENT_TIMESTAMP
            WHERE (
                id = $1 AND
                session_valid(expires_at::TIMESTAMP, last_activity::TIMESTAMP, timeout_duration::INTERVAL)
            )
            RETURNING account_id
        )
        SELECT id, email, first_name, last_name, admin 
        FROM Account_Session
        JOIN Account ON id = account_id;
    """, session_id_hash)

    if account_info is None:
        raise InvalidCredentials()

    return account_info


async def get_authenticated_user(request: Request):
    return await _get_authenticated_user(request)


async def get_admin_user(request: Request):
    account_info = await _get_authenticated_user(request)
    if not account_info.get('admin'):
        raise HTTPException(status_code=401, detail="You must be an admin to perform this action")
    return account_info


async def _get_authenticated_user(request: Request):
    try:
        account_info = await authenticate(request)
        session_id = request.cookies.get('session_id')

        request.scope["auth"] = ["user"]
        request.scope["user"] = account_info
        request.scope["session"] = session_id
        return account_info
    except InvalidCredentials:
        raise HTTPException(status_code=401, detail="You must be logged in to perform this action")


def set_session_cookie(response, session_id):
    response.set_cookie(
        key='session_id',
        value=session_id,
        max_age=timedelta(hours=168).total_seconds(),
        expires=timedelta(hours=48).total_seconds(),
        path='/',
        secure=False,
        httponly=True,
        samesite='strict'
    )
