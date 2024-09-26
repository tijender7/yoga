from fastapi import FastAPI, HTTPException, BackgroundTasks
import requests
from requests.auth import HTTPBasicAuth
from pydantic import BaseModel
from app.services.razorpay_service import create_razorpay_customer
from app.db import supabase
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

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Setting up auth state change listener")
    supabase.auth.on_auth_state_change(on_auth_state_change)

async def on_auth_state_change(event, session):
    logger.info(f"Auth state change event: {event}")
    if event == 'SIGNED_UP':
        logger.info(f"New user signed up: {session.user.email if session and session.user else 'Unknown'}")
        if session and session.user:
            user = session.user
            try:
                background_tasks = BackgroundTasks()
                background_tasks.add_task(create_razorpay_customer, user.id)
                logger.info(f"Added Razorpay customer creation task for user {user.id}")
            except Exception as e:
                logger.error(f"Error in on_auth_state_change: {str(e)}")
                # Here, we should handle the error and possibly notify the frontend
        else:
            logger.error("User session or user data is missing")

def update_user_profile(user_id: str, customer_id: str):
    try:
        supabase.table('profiles').update({'razorpay_customer_id': customer_id}).eq('id', user_id).execute()
        logger.info(f"Updated Razorpay customer ID for user {user_id}")
    except Exception as e:
        logger.error(f"Failed to update profile for user {user_id}: {str(e)}")

@app.post("/api/create-razorpay-customer")
async def create_customer(user_data: dict, background_tasks: BackgroundTasks):
    user_id = user_data.get('userId')
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")

    try:
        customer_id = await create_razorpay_customer(user_id)
        if customer_id:
            background_tasks.add_task(update_user_profile, user_id, customer_id)
            return {"status": "success", "customer_id": customer_id}
        else:
            raise HTTPException(status_code=500, detail="Failed to create Razorpay customer after multiple attempts")
    except Exception as e:
        logger.error(f"Error in create_customer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/callback")
async def auth_callback(user: dict, background_tasks: BackgroundTasks):
    user_id = user.get('id')
    if user_id:
        background_tasks.add_task(create_razorpay_customer, user_id)
    return {"status": "success"}

async def create_user_profile(user_id: str, email: str, full_name: str = ''):
    try:
        result = await supabase.table('user_profiles').insert({
            'user_id': user_id,
            'email': email,
            'full_name': full_name
        }).execute()
        logger.info(f"Created profile for user {user_id}")
        return result
    except Exception as e:
        logger.error(f"Failed to create profile for user {user_id}: {str(e)}")
        return None

async def update_user_profile(user_id: str, customer_id: str):
    try:
        result = await supabase.table('user_profiles').update({
            'razorpay_customer_id': customer_id
        }).eq('user_id', user_id).execute()
        if result.error:
            logger.error(f"Failed to update user profile: {result.error}")
        else:
            logger.info(f"Updated Razorpay customer ID for user {user_id}")
    except Exception as e:
        logger.error(f"Failed to update profile for user {user_id}: {str(e)}")
