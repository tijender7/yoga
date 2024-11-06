import razorpay
from app.config import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_CALLBACK_URL
import logging

logger = logging.getLogger(__name__)
client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

async def create_payment_link(amount: int, currency: str = 'INR', description: str = ''):
    try:
        payment_link = client.payment_link.create({
            "amount": amount,
            "currency": currency,
            "accept_partial": False,
            "description": description,
            "callback_url": RAZORPAY_CALLBACK_URL,
            "callback_method": "post"
        })
        return payment_link['short_url']
    except Exception as e:
        logger.error(f"Payment link creation failed: {str(e)}")
        raise
