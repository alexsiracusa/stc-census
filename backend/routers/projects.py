from fastapi import APIRouter, Response, Request, status
from ..database import data

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def get_projects(
    response: Response,
):
    try:
        projects = await data.get_projects()
        response.status_code = status.HTTP_200_OK
        return {"projects": projects}

    except Exception as error:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(error)}