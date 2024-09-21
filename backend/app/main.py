from fastapi import FastAPI, HTTPException
import requests
from requests.auth import HTTPBasicAuth
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

# Replace with your PayPal credentials (make sure these match your test files)
CLIENT_ID = "AWIElPGQNAuNq7pL4HRgO_AsWWUGqQ5AOuWjfuEMv-XNFRkpKxXIaSxFmGpfrkaKKjN3T2lCFfUsq2ll"
CLIENT_SECRET = "EG39FluJWWbkcPZVUM82_DXsKDTrsJlSJHMPsXQdHHrS4Umx95M-5kfrQb2j2RhJgcL2M317lytSTILa"

# Plan IDs from your PayPal sandbox environment
PLAN_IDS = {
    "1-month": "P-5SR564712B187420MM3WZPNQ",
    "6-months": "P-7K061988RV377222CM3WZPNQ",
    "12-months": "P-4TK765258D783270SM3WZPNY"
}

class SubscriptionRequest(BaseModel):
    plan_type: str
    user_email: str
    user_first_name: str
    user_last_name: str

@app.post("/generate-token")
def generate_paypal_token():
    """
    Generate a PayPal access token using HTTPBasicAuth.
    """
    try:
        url = "https://api.sandbox.paypal.com/v1/oauth2/token"
        headers = {
            "Accept": "application/json",
            "Accept-Language": "en_US"
        }
        data = {
            "grant_type": "client_credentials"
        }
        auth = HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)

        response = requests.post(url, headers=headers, data=data, auth=auth)
        
        if response.status_code == 200:
            return {"access_token": response.json()['access_token']}
        else:
            raise Exception(f"Failed to get access token: {response.json()}")

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/create-subscription")
def create_subscription(request: SubscriptionRequest):
    try:
        # Get access token
        access_token = generate_paypal_token()["access_token"]

        # Create subscription
        url = "https://api.sandbox.paypal.com/v1/billing/subscriptions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        data = {
            "plan_id": PLAN_IDS.get(request.plan_type),
            "subscriber": {
                "name": {
                    "given_name": request.user_first_name,
                    "surname": request.user_last_name
                },
                "email_address": request.user_email
            },
            "application_context": {
                "brand_name": "Your Yoga Brand",
                "locale": "en-US",
                "shipping_preference": "NO_SHIPPING",
                "user_action": "SUBSCRIBE_NOW",
                "return_url": "https://example.com/return",
                "cancel_url": "https://example.com/cancel"
            }
        }

        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 201:
            return response.json()
        else:
            raise Exception(f"Failed to create subscription: {response.json()}")

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
