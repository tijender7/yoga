from fastapi import FastAPI, HTTPException, Request
from app.services.razorpay_service import create_payment_link
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.config import FRONTEND_URL, IS_DEVELOPMENT, PAYMENT_STATUS_MAP, RAZORPAY_CALLBACK_URL
from datetime import datetime
from app.services.supabase_service import supabase
from fastapi.responses import JSONResponse
from typing import Dict, Any
from pydantic import BaseModel, Field
from typing import Optional
from pydantic import EmailStr
import secrets

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",  # Frontend URL
    "https://api.razorpay.com",  # Add your frontend URL
    "*ngrok-free.app",  # Allow ngrok URLs
    "https://checkout.razorpay.com"  # Add this
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

HANDLED_EVENTS = {
    'payment.captured': 'Payment successful',
    'payment.failed': 'Payment failed',
    'payment.pending': 'Payment pending',
    'payment.downtime': 'Payment system downtime notification'
}

class PaymentEntity(BaseModel):
    id: str
    status: str
    amount: int
    currency: str

class PaymentPayload(BaseModel):
    payment: dict = Field(..., description="Payment details")

class WebhookPayload(BaseModel):
    event: str
    payload: Dict[str, Any]  # Make it flexible to handle different payload types

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    healthConditions: Optional[str] = None
    userId: Optional[str] = None
    username: Optional[str] = None
    interest: Optional[str] = None
    source: Optional[str] = None

@app.post("/api/create-payment")
async def create_payment_endpoint(payment_data: dict):
    try:
        amount = payment_data.get('amount')
        currency = payment_data.get('currency', 'INR')
        description = payment_data.get('description', 'Yoga Class Payment')
        
        payment_link = await create_payment_link(amount, currency, description)
        return {"payment_link": payment_link}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/razorpay-webhook")
async def payment_webhook(request: Request):
    try:
        payload = await request.json()
        webhook_data = WebhookPayload(**payload)
        
        # Log the event type
        logger.info(f"Webhook event received: {webhook_data.event}")
        
        # Handle different event types
        if webhook_data.event.startswith('payment.'):
            # Payment related events
            payment_entity = webhook_data.payload.get('payment', {}).get('entity')
            if payment_entity:
                payment_id = payment_entity.get('id')
                if payment_id:
                    # Process payment
                    existing_payment = supabase.table('payments')\
                        .select('*')\
                        .eq('razorpay_payment_id', payment_id)\
                        .execute()
                    
                    if existing_payment.data:
                        # Update existing payment
                        result = supabase.table('payments')\
                            .update({
                                'status': PAYMENT_STATUS_MAP.get(payment_entity['status'], 'pending'),
                                'updated_at': datetime.now().isoformat()
                            })\
                            .eq('razorpay_payment_id', payment_id)\
                            .execute()
                        logger.info(f"Payment updated: {payment_id}")
                    else:
                        # Create new payment record
                        result = supabase.table('payments')\
                            .insert({
                                'razorpay_payment_id': payment_id,
                                'status': PAYMENT_STATUS_MAP.get(payment_entity['status'], 'pending'),
                                'amount': payment_entity['amount'],
                                'currency': payment_entity['currency'],
                                'payment_method': 'razorpay',
                                'payment_details': payment_entity
                            })\
                            .execute()
                        logger.info(f"New payment created: {payment_id}")
                    
                    return JSONResponse(
                        status_code=200,
                        content={
                            "status": "success",
                            "message": "Payment processed successfully",
                            "payment_id": payment_id
                        }
                    )
        
        # Handle non-payment events (like downtime notifications)
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": f"Webhook received for event: {webhook_data.event}"
            }
        )
        
    except Exception as e:
        return handle_webhook_error(e)

def handle_webhook_error(e: Exception) -> JSONResponse:
    error_message = str(e)
    if "ValidationError" in error_message:
        logger.warning(f"Received unhandled webhook event: {error_message}")
        return JSONResponse(
            status_code=200,  # Return 200 for unhandled events
            content={
                "status": "success",
                "message": "Unhandled webhook event acknowledged"
            }
        )
    
    logger.error(f"Webhook processing failed: {error_message}")
    return JSONResponse(
        status_code=400,
        content={
            "status": "error",
            "message": error_message
        }
    )

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "webhook_url": RAZORPAY_CALLBACK_URL,
        "environment": "development" if IS_DEVELOPMENT else "production"
    }

@app.post("/api/create-user")
async def create_user(user: UserCreate):
    try:
        # 1. Insert into users table
        if user.userId:
            users_result = supabase.table('users').insert({
                'id': user.userId,
                'email': user.email,
                'full_name': user.name,
                'username': user.email.split('@')[0]
            }).execute()

            if not users_result.data:
                logger.warning(f"Failed to create user record for: {user.email}")

            # 2. Insert into profiles table
            profiles_result = supabase.table('profiles').insert({
                'id': user.userId,
                'username': user.email.split('@')[0],  # Using email prefix as username
                'full_name': user.name
            }).execute()

            if not profiles_result.data:
                logger.warning(f"Failed to create profile for: {user.email}")

        # 3. Create user interaction
        result = supabase.table('user_interactions').insert({
            'email': user.email,
            'name': user.name,
            'phone_number': user.phone,
            'health_conditions': user.healthConditions or '',
            'interest': 'Free Weekend Class',
            'source': 'get_started',
            'account_created': True
        }).execute()

        if not result.data:
            raise HTTPException(status_code=400, detail="Failed to create user interaction")

        logger.info(f"User created successfully: {user.email}")
        return {"status": "success", "message": "User created successfully"}

    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/signup")
async def create_auth_user(user_data: dict):
    try:
        # Create auth user
        auth_response = supabase.auth.sign_up({
            "email": user_data["email"],
            "password": user_data.get("password") or secrets.token_urlsafe(8),
            "options": {
                "data": {
                    "full_name": user_data["name"],
                    "phone": user_data.get("phone"),
                    "healthConditions": user_data.get("healthConditions"),
                    "interest": user_data.get("interest")
                },
                "email_redirect_to": f"{FRONTEND_URL}/reset-password"
            }
        })

        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Failed to create auth user")

        # Create user in database tables
        await create_user(UserCreate(
            userId=auth_response.user.id,
            email=user_data["email"],
            name=user_data["name"],  # Make sure name is passed
            phone=user_data.get("phone"),
            healthConditions=user_data.get("healthConditions"),
            interest=user_data.get("interest"),
            source=user_data.get("source", "get_started")
        ))

        return {
            "status": "success",
            "userId": auth_response.user.id,
            "message": "User created successfully"
        }

    except Exception as e:
        logger.error(f"Error creating auth user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))