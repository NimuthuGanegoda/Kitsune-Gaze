from pydantic import BaseModel
from typing import List, Optional

class Breach(BaseModel):
    name: str
    title: str
    domain: Optional[str] = None
    breach_date: str
    added_date: str
    pwn_count: int
    description: str
    data_classes: List[str]
    logo_path: Optional[str] = None

class EmailBreachResult(BaseModel):
    source: str
    date: str
    data_leaked: List[str]

class EmailCheckResponse(BaseModel):
    is_breached: bool
    breaches: List[EmailBreachResult]
    risk_score: Optional[int] = 0

class PasswordCheckResponse(BaseModel):
    is_pwned: bool
    count: int
    message: str
