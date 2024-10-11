import os
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from .env
load_dotenv()

# PayPal Credentials

API_BASE_URL = 'http://localhost:8000'
NGROK_URL = os.getenv("NGROK_URL")
if not NGROK_URL:
    raise ValueError("NGROK_URL must be set in the environment variables")
RAZORPAY_CALLBACK_URL = f"{NGROK_URL}/razorpay-webhook"

# Supabase credentials (existing setup)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


# Razorpay credentials
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET")

# Update RAZORPAY_CALLBACK_URL
RAZORPAY_CALLBACK_URL = f"{NGROK_URL}/webhook/razorpay"

# Add this check
if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET or not RAZORPAY_WEBHOOK_SECRET:
    raise ValueError("Razorpay credentials (KEY_ID, KEY_SECRET, and WEBHOOK_SECRET) must be set in the environment variables")

# Add this after loading environment variables
logger.info(f"[CONFIG] Loaded RAZORPAY_KEY_ID: {RAZORPAY_KEY_ID[:5]}...")
logger.info(f"[CONFIG] Loaded RAZORPAY_KEY_SECRET: {RAZORPAY_KEY_SECRET[:5]}...")
logger.info(f"[CONFIG] Loaded RAZORPAY_WEBHOOK_SECRET: {RAZORPAY_WEBHOOK_SECRET[:5]}...")
logger.info(f"[CONFIG] RAZORPAY_CALLBACK_URL set to: {RAZORPAY_CALLBACK_URL}")

# Validation add karein
if not NGROK_URL:
    raise ValueError("NGROK_URL must be set in the environment variables")

logger.info(f"[CONFIG] NGROK_URL set to: {NGROK_URL}")
logger.info(f"[CONFIG] RAZORPAY_CALLBACK_URL set to: {RAZORPAY_CALLBACK_URL}")
