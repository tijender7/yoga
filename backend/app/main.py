from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel
from app.services.razorpay_service import create_or_get_razorpay_customer, create_subscription, check_subscription_status, fetch_subscription_details, create_payment_link, insert_subscription, update_subscription_status, check_subscription_status_from_db, get_user_details
from app.db import supabase
import logging
import json
from fastapi.middleware.cors import CORSMiddleware
from razorpay.errors import SignatureVerificationError
import os
from datetime import datetime, timedelta
from app.config import API_BASE_URL, RAZORPAY_CALLBACK_URL, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET, IS_DEVELOPMENT
import razorpay
import hmac
import hashlib
from app.services.paypal_service import create_paypal_subscription
from fastapi.responses import JSONResponse

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
    allow_origins=["http://localhost:3000", "https://api.razorpay.com"],  # Add your frontend URL
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

@app.post("/razorpay-webhook")
async def razorpay_webhook(request: Request):
    try:
        payload = await request.body()
        data = json.loads(payload)
        
        logger.info(f"[WEBHOOK] Received payload: {data}")
        
        event = data.get('event')
        payment = data['payload'].get('payment', {}).get('entity', {})
        
        # Get email from payment data
        email = payment.get('email')
        
        # Fetch user details from Supabase using email
        user_response = supabase.table('users').select('*').eq('email', email).execute()
        
        user_details = None
        if user_response.data:
            user_details = user_response.data[0]
            
        # Prepare payment data with verified user details
        payment_data = {
            'razorpay_payment_id': payment.get('id'),
            'razorpay_order_id': payment.get('order_id'),
            'status': payment.get('status'),
            'amount': payment.get('amount') / 100,
            'currency': payment.get('currency'),
            'payment_method': payment.get('method'),
            'user_id': user_details.get('id') if user_details else None,
            'email': user_details.get('email') if user_details else email,
            'contact': user_details.get('contact') if user_details else payment.get('contact'),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'payment_details': {
                'wallet': payment.get('wallet'),
                'international': payment.get('international'),
                'fee': payment.get('fee'),
                'tax': payment.get('tax'),
                'acquirer_data': payment.get('acquirer_data')
            }
        }
        
        logger.info(f"[WEBHOOK] Payment data to insert: {payment_data}")
        
        try:
            # First try to update if payment exists
            update_result = supabase.table('payments')\
                .update(payment_data)\
                .eq('razorpay_payment_id', payment_data['razorpay_payment_id'])\
                .execute()
                
            if not update_result.data:
                # If no rows were updated, insert new payment
                insert_result = supabase.table('payments')\
                    .insert(payment_data)\
                    .execute()
                logger.info(f"[WEBHOOK] Payment inserted successfully")
            else:
                logger.info(f"[WEBHOOK] Payment updated successfully")
                
            return {'status': 'success'}
            
        except Exception as db_error:
            logger.error(f"[WEBHOOK] Database operation failed: {str(db_error)}")
            return JSONResponse(
                status_code=500,
                content={"error": str(db_error)}
            )
            
    except Exception as e:
        logger.error(f"[WEBHOOK] Error processing webhook: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

async def update_subscription_status(subscription_id: str, status: str, payment_id: str = None):
    logger.info(f"[WEBHOOK] Updating subscription status: {subscription_id} to {status}")
    try:
        update_data = {
            'status': status,
            'updated_at': datetime.now().isoformat()
        }
        if payment_id:
            update_data['last_payment_id'] = payment_id

        result = supabase.table('subscriptions').update(update_data).eq('razorpay_subscription_id', subscription_id).execute()
        
        if result.data:
            logger.info(f"[WEBHOOK] Subscription status updated successfully: {subscription_id} - {status}")
            logger.info(f"[WEBHOOK] Updated data: {result.data}")
        else:
            logger.error(f"[WEBHOOK] Error updating subscription status: {result.error}")
        
        return result.data
    except Exception as e:
        logger.error(f"[WEBHOOK] Failed to update subscription status: {str(e)}")
        raise


@app.post("/api/create-subscription")
async def create_subscription_endpoint(subscription_data: dict):
    logger.info(f"[START] Received subscription request: {subscription_data}")
    user_id = subscription_data.get('customerId')
    plan_type = subscription_data.get('planType')
    region = subscription_data.get('region')
    
    print(f"IS_DEVELOPMENT: {IS_DEVELOPMENT}")  # Debug ke liye
    
    if not user_id or not plan_type or not region:
        logger.error(f"[ERROR] Missing data. Received: {subscription_data}")
        raise HTTPException(status_code=400, detail="User ID, Plan Type, and Region are required")

    try:
        existing_subscription = await check_subscription_status_from_db(user_id)
        print(f"IS_DEVELOPMENT: {IS_DEVELOPMENT}")  # Debug ke liye
        if existing_subscription['status'] == 'active' and not IS_DEVELOPMENT:
            logger.warning(f"User {user_id} already has an active subscription. Rejecting new subscription request.")
            return {"status": "error", "message": "User already has an active subscription"}
        elif existing_subscription['status'] == 'active' and IS_DEVELOPMENT:
            logger.warning(f"Creating new subscription for user {user_id} in development mode, despite having an active subscription")

        logger.info(f"[STEP 1] Fetching subscription_plan_id for plan_type: {plan_type} and region: {region}")
        yoga_pricing_response = supabase.table('yoga_pricing').select('subscription_plan_id').eq('plan_type', plan_type).eq('region', region).execute()
        logger.info(f"[STEP 1] Yoga pricing response: {yoga_pricing_response}")
        
        if not yoga_pricing_response.data:
            logger.error(f"[ERROR] No pricing plan found for plan type {plan_type} and region {region}")
            raise HTTPException(status_code=404, detail="Pricing plan not found")
        
        subscription_plan_id = yoga_pricing_response.data[0]['subscription_plan_id']
        logger.info(f"[STEP 1] Fetched subscription_plan_id: {subscription_plan_id}")
        
        if subscription_plan_id is None:
            logger.error(f"[ERROR] subscription_plan_id is None for plan type {plan_type} and region {region}")
            raise HTTPException(status_code=400, detail="Invalid subscription plan")

        logger.info(f"[STEP 2] Fetching Razorpay plan ID for subscription_plan_id: {subscription_plan_id}")
        plan_response = supabase.table('subscription_plans').select('razorpay_plan_id').eq('id', subscription_plan_id).execute()
        logger.info(f"[STEP 2] Subscription plan response: {plan_response}")
        
        if not plan_response.data:
            logger.error(f"[ERROR] No Razorpay plan found for subscription_plan_id {subscription_plan_id}")
            raise HTTPException(status_code=404, detail="Razorpay plan not found")
        
        razorpay_plan_id = plan_response.data[0]['razorpay_plan_id']
        logger.info(f"[STEP 2] Fetched razorpay_plan_id: {razorpay_plan_id}")

        logger.info(f"[STEP 4] Creating subscription with plan: {razorpay_plan_id}")
        subscription_id, status, payment_link = await create_subscription(razorpay_plan_id)
        logger.info(f"[STEP 4] Subscription created: {subscription_id}, Status: {status}, Payment link: {payment_link}")

        # New code to insert subscription data into Supabase
        if status == 'created':
            subscription_insert_data = {
                'user_id': user_id,
                'razorpay_plan_id': razorpay_plan_id,
                'razorpay_subscription_id': subscription_id,
                'status': status,
                'start_date': datetime.now().isoformat(),
                'end_date': (datetime.now() + timedelta(days=365)).isoformat(),
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            insert_result = supabase.table('subscriptions').insert(subscription_insert_data).execute()
            logger.info(f"[STEP 5] Subscription inserted into database: {insert_result}")

        if status == 'created' and payment_link:
            logger.info("[SUCCESS] Subscription process completed successfully")
            return {
                "status": "success", 
                "subscription_id": subscription_id, 
                "payment_link": payment_link,
                "razorpay_key": RAZORPAY_KEY_ID,
                "razorpay_plan_id": razorpay_plan_id
            }
        else:
            logger.error(f"[ERROR] Subscription created but status is {status}")
            return {"status": "error", "message": f"Subscription created but status is {status}"}
    except Exception as e:
        logger.error(f"[CRITICAL ERROR] Error creating subscription: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/check-subscription-status")
async def check_subscription_status(data: dict):
    user_id = data.get('userId')
    logger.info(f"[START] Checking subscription status. Data: {data}")
    
    result = await check_subscription_status_from_db(user_id)
    
    logger.info(f"[RESULT] Subscription status for user {user_id}: {result}")
    
    return {"status": result['status']}

@app.post("/api/insert-subscription")
async def insert_subscription_endpoint(subscription_data: dict):
    logger.info(f"[START] Inserting subscription. Data: {subscription_data}")
    try:
        user_id = subscription_data.get('userId')
        subscription_id = subscription_data.get('subscriptionId')
        plan_type = subscription_data.get('planType')
        region = subscription_data.get('region')
        razorpay_plan_id = subscription_data.get('razorpayPlanId')
        
        if not all([user_id, subscription_id, plan_type, region, razorpay_plan_id]):
            raise HTTPException(status_code=400, detail="Missing required data")
        
        # Fetch plan_id from subscription_plans table
        plan_response = supabase.table('subscription_plans').select('id').eq('razorpay_plan_id', razorpay_plan_id).execute()
        if not plan_response.data:
            raise HTTPException(status_code=404, detail="Subscription plan not found")
        plan_id = plan_response.data[0]['id']
        
        # Fetch subscription details from Razorpay
        subscription_details = await fetch_subscription_details(subscription_id)
        status = subscription_details.get('status', 'unknown')
        
        # Insert subscription into database
        subscription_data = {
            'user_id': user_id,
            'plan_id': plan_id,
            'razorpay_subscription_id': subscription_id,
            'status': status,
            'start_date': datetime.now().isoformat(),
            'end_date': (datetime.now() + timedelta(days=365)).isoformat(),  # Assuming 1-year subscription
        }
        result = supabase.table('subscriptions').insert(subscription_data).execute()
        
        logger.info(f"[SUCCESS] Subscription inserted: {result}")
        return {"status": "success"}
    except Exception as e:
        logger.error(f"[ERROR] Failed to insert subscription: {str(e)}")
        return {"status": "error", "message": str(e)}

@app.post("/api/create-paypal-subscription")
async def create_paypal_subscription_endpoint(request: Request):
    try:
        data = await request.json()
        customer_id = data['customerId']
        plan_type = data['planType']
        region = data['region']

        # TODO: Implement PayPal subscription creation logic
        # For now, we'll just return a dummy response
        subscription_data = {
            "id": "dummy_paypal_subscription_id",
            "status": "APPROVAL_PENDING",
            "plan_id": "dummy_plan_id",
        }

        return JSONResponse(content=subscription_data, status_code=200)
    except Exception as e:
        logger.error(f"Error creating PayPal subscription: {str(e)}")
        return JSONResponse(content={"error": str(e)}, status_code=500)