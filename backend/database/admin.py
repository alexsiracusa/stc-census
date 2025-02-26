from pydantic import BaseModel
from fastapi import Request
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
    expires_at = session_start + timedelta(hours=24)
    last_activity = session_start
    timout_duration = timedelta(hours=8)

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
        "last_name": account.last_name
    }


async def login(account: AccountLogin, host):
    # get stored hash value from database
    record = await client.postgres_client.fetch_row("""
        SELECT id, email, first_name, last_name, password_hash 
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
        "last_name": record.get('last_name')
    }


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
        SELECT id, email, first_name, last_name 
        FROM Account_Session
        JOIN Account ON id = account_id;
    """, session_id_hash)

    if account_info is None:
        raise InvalidCredentials()

    return account_info


def set_session_cookie(response, session_id):
    response.set_cookie(
        key='session_id',
        value=session_id,
        max_age=timedelta(hours=24).total_seconds(),
        expires=timedelta(hours=8).total_seconds(),
        path='/',
        secure=False,
        httponly=True,
        samesite='strict'
    )
