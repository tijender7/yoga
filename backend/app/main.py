from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel
from app.services.razorpay_service import create_or_get_razorpay_customer, create_subscription, check_subscription_status, fetch_subscription_details, create_payment_link
from app.db import supabase
import logging
import json
from fastapi.middleware.cors import CORSMiddleware
from razorpay.errors import SignatureVerificationError

import razorpay
from app.config import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET

# Initialize Razorpay client
client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Initialize FastAPI app
app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",  # Frontend URL
    "http://127.0.0.1:3000",  # Alternative frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# New route to handle user creation from frontend
@app.post("/api/create-user")
async def create_user(user_data: dict, background_tasks: BackgroundTasks):
    user_id = user_data.get('userId')
    email = user_data.get('email')
    username = user_data.get('username') 

    if not user_id or not email:
        raise HTTPException(status_code=400, detail="User ID and email are required")

    try:
        # 1. Insert into your 'users' table
        response = supabase.table('users').insert({
            'id': user_id,
            'email': email,
            'username': username, 
        }).execute()

        # Log the entire response
        logger.info(f"Supabase Response: {json.dumps(response.__dict__, default=str)}")

        # Check for errors in the response
        if hasattr(response, 'error') and response.error:
            logger.error(f"Error inserting user: {response.error}")
            raise HTTPException(status_code=500, detail="Failed to create user in the database")

        # If no error, assume success
        # 2. Trigger Razorpay customer creation (if needed)
        background_tasks.add_task(create_or_get_razorpay_customer, user_id) 

        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error in create_user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    logger.info("Setting up auth state change listener")
    supabase.auth.on_auth_state_change(on_auth_state_change)
    logger.info("Auth state change listener set up successfully")

async def on_auth_state_change(event, session):
    logger.info(f"Auth state change event received: {event}")
    if event == 'SIGNED_UP' and session and session.user:
        user = session.user
        logger.info(f"New user signed up: {user.email}")
        try:
            result = await supabase.table('users').insert({
                'id': user.id,
                'email': user.email,
                'full_name': user.user_metadata.get('full_name', '')
            }).execute()
            logger.info(f"User inserted successfully: {user.id}")
        except Exception as e:
            logger.error(f"Error inserting user: {str(e)}")

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
        customer_id = await create_or_get_razorpay_customer(user_id)
        if customer_id:
            background_tasks.add_task(update_user_profile, user_id, customer_id)
            return {"status": "success", "customer_id": customer_id}
        else:
            raise HTTPException(status_code=500, detail="Failed to create Razorpay customer")
    except Exception as e:
        logger.error(f"Error in create_customer: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/callback")
async def auth_callback(user: dict, background_tasks: BackgroundTasks):
    user_id = user.get('id')
    if user_id:
        background_tasks.add_task(create_or_get_razorpay_customer, user_id)
    return {"status": "success"}

async def create_user_profile(user_id: str, email: str, full_name: str = ''):
    logger.info(f"Attempting to create profile for user {user_id}")
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

@app.get("/test")
async def test_endpoint():
    logger.info("Test endpoint called")
    return {"message": "Backend is working!"}

@app.post("/webhook/razorpay")
async def razorpay_webhook(request: Request):
    payload = await request.json()
    signature = request.headers.get("X-Razorpay-Signature", "")

    try:
        client.utility.verify_webhook_signature(json.dumps(payload, separators=(',', ':')), signature, RAZORPAY_WEBHOOK_SECRET)
    except SignatureVerificationError:
        logger.error("Invalid webhook signature")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle different event types
    event = payload.get('event')
    if event == 'subscription.charged':
        # Handle successful subscription charge
        subscription_id = payload['payload']['subscription']['entity']['id']
        # Update subscription status in your database
        await update_subscription_status(subscription_id, 'active')
    elif event == 'subscription.cancelled':
        # Handle subscription cancellation
        subscription_id = payload['payload']['subscription']['entity']['id']
        await update_subscription_status(subscription_id, 'cancelled')
    
    return {"status": "success"}

async def update_subscription_status(subscription_id: str, status: str):
    try:
        result = await supabase.table('subscriptions').update({
            'status': status
        }).eq('subscription_id', subscription_id).execute()
        if result.error:
            logger.error(f"Failed to update subscription status: {result.error}")
        else:
            logger.info(f"Updated subscription status for {subscription_id} to {status}")
    except Exception as e:
        logger.error(f"Failed to update subscription status: {str(e)}")

@app.post("/api/create-subscription")
async def create_subscription_endpoint(subscription_data: dict):
    logger.info(f"Received subscription request: {subscription_data}")
    user_id = subscription_data.get('customerId')
    plan_id = subscription_data.get('planId')
    
    if not user_id or not plan_id:
        logger.error(f"User ID or Plan ID missing. Data received: {subscription_data}")
        raise HTTPException(status_code=400, detail="User ID and Plan ID are required")

    try:
        # Fetch Razorpay customer ID from razorpay_customers table
        customer_response = supabase.table('razorpay_customers').select('razorpay_customer_id').eq('id', user_id).execute()
        if not customer_response.data:
            logger.error(f"No Razorpay customer found for user {user_id}")
            raise HTTPException(status_code=404, detail="Razorpay customer not found")
        
        razorpay_customer_id = customer_response.data[0]['razorpay_customer_id']
        logger.info(f"Found Razorpay customer ID: {razorpay_customer_id} for user {user_id}")

        logger.info(f"Creating subscription for customer {razorpay_customer_id} with plan {plan_id}")
        subscription_id, status, payment_link = await create_subscription(razorpay_customer_id, plan_id)
        logger.info(f"Subscription created: {subscription_id}, Status: {status}, Payment link: {payment_link}")

        if status == 'created' and payment_link:
            return {"status": "success", "subscription_id": subscription_id, "payment_link": payment_link}
        else:
            return {"status": "error", "message": f"Subscription created but status is {status}"}
    except Exception as e:
        logger.error(f"Error creating subscription: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/check-subscription/{subscription_id}")
async def check_subscription_endpoint(subscription_id: str):
    try:
        status = await check_subscription_status(subscription_id)
        return {"status": "success", "subscription_status": status}
    except Exception as e:
        logger.error(f"Error checking subscription status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))