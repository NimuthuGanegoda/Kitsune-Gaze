import httpx
import hashlib
from typing import List
from app.models.schemas import Breach, EmailCheckResponse, EmailBreachResult, PasswordCheckResponse

class BreachService:
    @staticmethod
    async def get_all_breaches() -> List[Breach]:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get("https://haveibeenpwned.com/api/v3/breaches", headers={"User-Agent": "Kitsune-Gaze-App"})
                response.raise_for_status()
                data = response.json()
                return [
                    Breach(
                        name=b["Name"],
                        title=b["Title"],
                        domain=b.get("Domain"),
                        breach_date=b["BreachDate"],
                        added_date=b["AddedDate"],
                        pwn_count=b["PwnCount"],
                        description=b["Description"],
                        data_classes=b["DataClasses"],
                        logo_path=b.get("LogoPath")
                    ) for b in data[:20]  # Return top 20 for the dashboard
                ]
            except Exception:
                return []

    @staticmethod
    async def check_email(email: str) -> EmailCheckResponse:
        async with httpx.AsyncClient() as client:
            try:
                url = f"https://api.xposedornot.com/v1/breach-analytics?email={email}"
                response = await client.get(url, headers={"User-Agent": "Kitsune-Gaze-App"})
                
                if response.status_code == 404:
                    return EmailCheckResponse(is_breached=False, breaches=[])
                
                response.raise_for_status()
                data = response.json()
                
                exposed_breaches = data.get("ExposedBreaches", {})
                breaches_details = exposed_breaches.get("breaches_details", [])
                risk_score = data.get("BreachMetrics", {}).get("risk", [{}])[0].get("risk_score", 0)
                
                results = [
                    EmailBreachResult(
                        source=b.get("breach", "Unknown"),
                        date=str(b.get("xposed_date", "Unknown")),
                        data_leaked=[item.strip() for item in b.get("xposed_data", "").split(";") if item.strip()]
                    ) for b in breaches_details
                ]
                
                return EmailCheckResponse(is_breached=len(results) > 0, breaches=results, risk_score=risk_score)
            except Exception:
                return EmailCheckResponse(is_breached=False, breaches=[])

    @staticmethod
    async def check_password(password: str) -> PasswordCheckResponse:
        # Implementing k-anonymity (HIBP Style)
        sha1hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
        prefix, suffix = sha1hash[:5], sha1hash[5:]
        
        async with httpx.AsyncClient() as client:
            try:
                url = f"https://api.pwnedpasswords.com/range/{prefix}"
                response = await client.get(url)
                response.raise_for_status()
                
                hashes = (line.split(':') for line in response.text.splitlines())
                for h, count in hashes:
                    if h == suffix:
                        return PasswordCheckResponse(
                            is_pwned=True, 
                            count=int(count), 
                            message=f"This password has been seen {count} times in known breaches."
                        )
                
                return PasswordCheckResponse(is_pwned=False, count=0, message="Good job. This password was not found in any known breaches.")
            except Exception:
                return PasswordCheckResponse(is_pwned=False, count=0, message="Error checking password service.")
