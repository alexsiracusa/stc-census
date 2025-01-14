from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from .database import admin, InvalidCredentials
from .routers import auth
import client

app = FastAPI()
app.include_router(auth.router)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    client.postgres_client = client.PostgresClient()


# Good tutorial on how to do authentication in fastapi:
# https://medium.com/@marcnealer/fastapi-http-authentication-f1bb2e8c3433
@app.middleware("http")
async def session_middleware(request: Request, call_next):
    session_id = request.cookies.get("session_id")
    if session_id:
        request.scope['session'] = session_id

    response = await call_next(request)
    return response


@app.middleware("http")
async def authentication_middleware(request: Request, call_next):
    try:
        account_info = await admin.authenticate(request)
        request.scope["auth"] = ["user"]
        request.scope["user"] = account_info
    except InvalidCredentials:
        request.scope["auth"] = ["anonymous"]
        request.scope["user"] = None

    response = await call_next(request)
    return response


@app.post("/test")
async def test(response: Response):
    try:
        print("test")
        response.status_code = status.HTTP_200_OK
        return {"message": "success"}
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        print(e)
