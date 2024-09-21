# routes/subscriptions.py
from fastapi import APIRouter, HTTPException
from app.services.paypal_service import create_paypal_subscription

router = APIRouter()

# Plan IDs from your PayPal sandbox/live environment
PLAN_IDS = {
    "1-month": "P-5SR564712B187420MM3WZPNQ",
    "6-months": "P-7K061988RV377222CM3WZPNQ",
    "12-months": "P-4TK765258D783270SM3WZPNY"
}

# Route for subscribing to the 1-month plan
@router.post("/subscribe/1-month")
async def subscribe_one_month(user_details: dict):
    try:
        subscription = create_paypal_subscription(PLAN_IDS["1-month"], user_details)
        return {"status": "success", "subscription": subscription}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Route for subscribing to the 6-months plan
@router.post("/subscribe/6-months")
async def subscribe_six_months(user_details: dict):
    try:
        subscription = create_paypal_subscription(PLAN_IDS["6-months"], user_details)
        return {"status": "success", "subscription": subscription}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Route for subscribing to the 12-months plan
@router.post("/subscribe/12-months")
async def subscribe_twelve_months(user_details: dict):
    try:
        subscription = create_paypal_subscription(PLAN_IDS["12-months"], user_details)
        return {"status": "success", "subscription": subscription}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
