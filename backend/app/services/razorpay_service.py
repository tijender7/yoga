import razorpay
from app.config import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
from app.db import supabase
import asyncio
import logging
from fastapi import HTTPException
from datetime import datetime, timedelta
import uuid
logger = logging.getLogger(__name__)
from app.config import API_BASE_URL, RAZORPAY_CALLBACK_URL, NGROK_URL
import json


client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

async def create_or_get_razorpay_customer(user_id: str, max_retries=3):
    logger.info(f"Starting Razorpay customer creation/fetch for user {user_id}")
    for attempt in range(max_retries):
        try:
            # Check if customer already exists in our database
            existing_customer = supabase.table('razorpay_customers').select('razorpay_customer_id').eq('id', user_id).execute()
            if existing_customer.data:
                logger.info(f"Existing Razorpay customer found for user {user_id}")
                return existing_customer.data[0]['razorpay_customer_id']

            # If not, fetch user details and create new customer
            user_response = supabase.table('users').select('*').eq('id', user_id).execute()
            if not user_response.data:
                logger.error(f"User not found: {user_id}")
                return None

            user_data = user_response.data[0]
            name = user_data.get('full_name', '')
            email = user_data.get('email', '')

            if not email:
                logger.error(f"Email not found for user: {user_id}")
                return None

            logger.info(f"Creating Razorpay customer for user {user_id}")
            customer = client.customer.create({
                "name": name,
                "email": email,
            })
            logger.info(f"Razorpay customer creation response: {customer}")

            # Insert into razorpay_customers table
            result = supabase.table('razorpay_customers').insert({
                'id': user_id,
                'razorpay_customer_id': customer['id']
            }).execute()

            if result.error:
                logger.error(f"Error inserting razorpay customer: {result.error}")
                raise Exception(result.error)

            logger.info(f"Successfully created Razorpay customer for user {user_id}")
            return customer['id']
        except razorpay.errors.BadRequestError as e:
            if "Customer already exists" in str(e):
                logger.warning(f"Customer already exists for user {user_id}. Fetching existing customer.")
                try:
                    # Fetch user email from Supabase
                    user_response = supabase.table('users').select('email').eq('id', user_id).execute()
                    if user_response.data:
                        email = user_response.data[0]['email']
                        # Fetch customer from Razorpay using email
                        existing_customers = client.customer.all({"email": email})
                        if existing_customers['count'] > 0:
                            existing_customer_id = existing_customers['items'][0]['id']
                            # Update our database with the existing Razorpay customer ID
                            supabase.table('razorpay_customers').upsert({
                                'id': user_id,
                                'razorpay_customer_id': existing_customer_id
                            }).execute()
                            logger.info(f"Updated existing Razorpay customer ID for user {user_id}")
                            return existing_customer_id
                except Exception as fetch_error:
                    logger.error(f"Error fetching existing customer: {str(fetch_error)}")
            logger.error(f"Attempt {attempt + 1} failed: Error creating/fetching Razorpay customer for user {user_id}: {str(e)}")
        except Exception as e:
            logger.error(f"Attempt {attempt + 1} failed: Error creating/fetching Razorpay customer for user {user_id}: {str(e)}")
        
        if attempt == max_retries - 1:
            logger.error(f"All attempts failed for user {user_id}")
            return None
        await asyncio.sleep(2 ** attempt)  # Exponential backoff
    return None

async def create_subscription(customer_id: str, plan_id: str):
    try:
        subscription = client.subscription.create({
            "plan_id": plan_id,
            "customer_id": customer_id,
            "total_count": 12,  # 12 billing cycles
            "customer_notify": 1
        })
        return subscription['id'], subscription['status'], subscription['short_url']
    except Exception as e:
        logger.error(f"Error creating subscription: {str(e)}")
        raise

async def check_subscription_status_from_db(user_id: str):
    try:
        response = supabase.table('subscriptions').select('*').eq('user_id', user_id).eq('status', 'active').limit(1).execute()
        subscriptions = response.data

        if subscriptions:
            subscription = subscriptions[0]
            logger.info(f"Active subscription for user {user_id}: {subscriptions}")
            logger.info(f"Active subscription found: {subscription}")
            
            return {
                'status': 'active',
                'plan_id': subscription['razorpay_plan_id'],  # Changed from 'plan_id' to 'razorpay_plan_id'
                'subscription_id': subscription['razorpay_subscription_id'],
                'start_date': subscription['start_date'],
                'end_date': subscription['end_date'],
                'next_billing_date': subscription['next_payment_date']
            }
        else:
            logger.info(f"No active subscription found for user {user_id}")
            return {'status': 'inactive'}
    except Exception as e:
        logger.error(f"Error checking subscription status from DB: {str(e)}")
        return {'status': 'error', 'message': str(e)}

async def check_subscription_status(user_id: str):
    try:
        subscription_status = await check_subscription_status_from_db(user_id)
        return subscription_status['status']
    except Exception as e:
        logger.error(f"Error checking subscription status: {str(e)}")
        return "error"

async def fetch_subscription_details(subscription_id: str):
    try:
        subscription = client.subscription.fetch(subscription_id)
        return subscription
    except Exception as e:
        logger.error(f"Error fetching subscription details: {str(e)}")
        raise

async def create_payment_link(amount: int, currency: str = 'INR', description: str = ''):
    try:
        payment_link = client.payment_link.create({
            "amount": amount,
            "currency": currency,
            "accept_partial": False,
            "description": description,
            "callback_url": RAZORPAY_CALLBACK_URL,
            "callback_method": "get"
        })
        return payment_link['short_url']
    except Exception as e:
        logger.error(f"Error creating payment link: {str(e)}")
        raise

async def insert_subscription(user_id: str, subscription_id: str, plan_id: str, status: str, monthly_price: float, currency: str):
    try:
        subscription_data = {
            'user_id': user_id,
            'razorpay_subscription_id': subscription_id,
            'plan_id': str(uuid.UUID(plan_id)),
            'status': status,
            'start_date': datetime.now().isoformat(),
            'end_date': (datetime.now() + timedelta(days=365)).isoformat(),
            'monthly_price': monthly_price,
            'currency': currency,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        # Comment out Supabase insert
        # result = await supabase.table('subscriptions').insert(subscription_data).execute()
        logger.info(f"[INFO] Subscription data prepared for user {user_id}: {subscription_data}")
        return subscription_data
    except Exception as e:
        logger.error(f"[ERROR] Failed to prepare subscription data: {str(e)}")
        raise

async def update_subscription_status(subscription_id: str, event_type: str):
    try:
        subscription = client.subscription.fetch(subscription_id)
        
        if event_type == 'subscription.authenticated':
            new_status = 'authenticated'
        elif event_type == 'subscription.activated':
            new_status = 'active'
        elif event_type == 'subscription.charged':
            new_status = 'charged'
        elif event_type == 'subscription.completed':
            new_status = 'completed'
        elif event_type == 'subscription.cancelled':
            new_status = 'cancelled'
        else:
            new_status = subscription['status']
        
        logger.info(f"Subscription {subscription_id} status updated to {new_status}")
        return new_status
    except Exception as e:
        logger.error(f"Error updating subscription status: {str(e)}")
        return "error"
