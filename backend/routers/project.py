from fastapi import APIRouter, Response, status
from ..database import data

router = APIRouter(
    prefix="/project",
    tags=["project"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
async def get_project(
    response: Response,
    project_id: int
):
    try:
        project = await data.get_project_by_id(project_id)
        response.status_code = status.HTTP_200_OK
        return project

    except Exception as error:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(error)}