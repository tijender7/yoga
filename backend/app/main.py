from fastapi import FastAPI, HTTPException, Request
from app.services.razorpay_service import create_payment_link
from fastapi.middleware.cors import CORSMiddleware
import logging

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

@app.post("/api/payment-webhook")
async def payment_webhook(request: Request):
    try:
        payload = await request.json()
        # Log payment status
        logger.info(f"Payment webhook received: {payload['event']}")
        
        # Update payment status in database
        if payload['event'] == 'payment.captured':
            # Update payment status in database
            payment_id = payload['payload']['payment']['entity']['id']
            # Update your database here
            
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Webhook processing failed: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid webhook payload")