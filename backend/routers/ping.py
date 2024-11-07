from fastapi import APIRouter, Response, status

router = APIRouter(
    prefix="/ping",
    tags=["ping"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def test(response: Response):
    response.status_code = status.HTTP_200_OK
    return {"message": "success"}
