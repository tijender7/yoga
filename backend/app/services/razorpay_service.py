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


def secure_log(message: str, data: dict = None):
    """Securely log messages without sensitive data"""
    if data:
        # Remove sensitive fields
        safe_data = {k: '****' if k in ['key', 'secret', 'password', 'token'] else v 
                    for k, v in data.items()}
        message = f"{message} - {safe_data}"
    logger.info(message)


async def create_subscription(plan_id: str):
    try:
        subscription = client.subscription.create({
            "plan_id": plan_id,
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

async def get_user_details(user_id: str):
    try:
        # Fetch user details from Supabase
        user_response = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_response.data:
            logger.error(f"User not found: {user_id}")
            return None
            
        user_data = user_response.data[0]
        return {
            'email': user_data.get('email'),
            'full_name': user_data.get('full_name'),
            'contact': user_data.get('contact')
        }
    except Exception as e:
        logger.error(f"Error fetching user details: {str(e)}")
        return None
