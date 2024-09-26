import os
import httpx
from dotenv import load_dotenv
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel

load_dotenv()

router = APIRouter()

VERIFY_TOKEN_URL = os.getenv("VERIFY_TOKEN")


class TokenRequest(BaseModel):
    app_key: str
    app_secret: str
    token: str


@router.post("/verify_token", tags=["Client Management"])
async def verify_token(request: TokenRequest):
    if not VERIFY_TOKEN_URL:
        raise HTTPException(status_code=500, detail="VERIFY_TOKEN URL is not configured")

    headers = {
        "accept": "application/json",
        "Content-Type": "application/json"
    }
    payload = {
        "app_key": request.app_key,
        "app_secret": request.app_secret,
        "token": request.token
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(VERIFY_TOKEN_URL, json=payload, headers=headers)
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=500, detail=f"An error occurred while making the request: {exc}")

    return response.json()
