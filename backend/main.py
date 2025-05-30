from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
import logging

from .utils.scheduler import setup_scheduler
from .routers import auth, project, projects, tasks, accounts, account
from . import client
from .config import FRONTEND_HOST


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI()
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(project.router)
app.include_router(tasks.router)
app.include_router(accounts.router)
app.include_router(account.router)

origins = [
    FRONTEND_HOST
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scheduler = None

@app.on_event("startup")
async def startup():
    client.postgres_client = client.PostgresClient()
    scheduler = setup_scheduler()

@app.on_event("shutdown")
async def shutdown():
    if scheduler:
        scheduler.shutdown()

# Good tutorial on how to do authentication in fastapi:
# https://medium.com/@marcnealer/fastapi-http-authentication-f1bb2e8c3433
@app.middleware("http")
async def session_middleware(request: Request, call_next):
    session_id = request.cookies.get("session_id")
    if session_id:
        request.scope['session'] = session_id

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
