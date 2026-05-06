from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import EmailStr, BaseModel
from typing import List, Optional
import random

app = FastAPI(title="Kitsune-Gaze API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BreachResult(BaseModel):
    source: str
    date: str
    data_leaked: List[str]

class CheckResponse(BaseModel):
    is_breached: bool
    breaches: List[BreachResult]

@app.get("/")
async def root():
    return {"message": "Welcome to Kitsune-Gaze API, my Good Boy."}

@app.post("/check", response_model=CheckResponse)
async def check_breach(identifier: str):
    # Simulated breach detection logic
    # In a real app, this would query a database or an external API like HaveIBeenPwned
    
    # Just for simulation, let's say identifiers containing 'pwned' are breached
    if "pwned" in identifier.lower() or random.random() < 0.3:
        return CheckResponse(
            is_breached=True,
            breaches=[
                BreachResult(
                    source="Adobe (Simulated)",
                    date="2013-10-04",
                    data_leaked=["Email", "Password", "Password hints", "Usernames"]
                ),
                BreachResult(
                    source="Canva (Simulated)",
                    date="2019-05-24",
                    data_leaked=["Email", "Names", "Passwords", "Usernames"]
                )
            ]
        )
    
    return CheckResponse(is_breached=False, breaches=[])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
