from fastapi import APIRouter, HTTPException
from app.services.breach_service import BreachService
from app.models.schemas import Breach, EmailCheckResponse, PasswordCheckResponse
from typing import List

router = APIRouter()

@router.get("/breaches", response_model=List[Breach])
async def get_breaches():
    return await BreachService.get_all_breaches()

@router.post("/check/email", response_model=EmailCheckResponse)
async def check_email(identifier: str):
    if not identifier:
        raise HTTPException(status_code=400, detail="Identifier is required.")
    return await BreachService.check_email(identifier)

@router.post("/check/password", response_model=PasswordCheckResponse)
async def check_password(password: str):
    if not password:
        raise HTTPException(status_code=400, detail="Password is required.")
    return await BreachService.check_password(password)
