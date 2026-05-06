from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import httpx

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
    return {"message": "Welcome to Kitsune-Gaze API."}

@app.post("/check", response_model=CheckResponse)
async def check_breach(identifier: str):
    # If the user enters a blank identifier
    if not identifier:
        return CheckResponse(is_breached=False, breaches=[])

    async with httpx.AsyncClient() as client:
        try:
            # We use the breach-analytics endpoint to get detailed information
            url = f"https://api.xposedornot.com/v1/breach-analytics?email={identifier}"
            response = await client.get(url, headers={"User-Agent": "Kitsune-Gaze-App"})
            
            if response.status_code == 404:
                # 404 from this API means no breaches found for this email
                return CheckResponse(is_breached=False, breaches=[])
                
            response.raise_for_status()
            data = response.json()
            
            # The API returns details inside 'ExposedBreaches' -> 'breaches_details'
            exposed_breaches = data.get("ExposedBreaches", {})
            if not exposed_breaches:
                return CheckResponse(is_breached=False, breaches=[])
                
            breaches_details = exposed_breaches.get("breaches_details", [])
            
            results = []
            for b in breaches_details:
                # The data_leaked field is a semicolon-separated string
                leaked_str = b.get("xposed_data", "")
                leaked_list = [item.strip() for item in leaked_str.split(";") if item.strip()]
                
                results.append(
                    BreachResult(
                        source=b.get("breach", "Unknown"),
                        date=str(b.get("xposed_date", "Unknown")),
                        data_leaked=leaked_list
                    )
                )
            
            return CheckResponse(
                is_breached=len(results) > 0,
                breaches=results
            )
            
        except httpx.HTTPStatusError as e:
            # If the API returns an error other than 404
            raise HTTPException(status_code=500, detail=f"External API error: {str(e)}")
        except httpx.RequestError as e:
            # If we fail to connect to the external API
            raise HTTPException(status_code=500, detail="Failed to reach breach detection service.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
