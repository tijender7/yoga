import os
import logging
from dotenv import load_dotenv
# Configure logging
logging.basicConfig(
    level=logging.INFO,  # Set to INFO or DEBUG based on your needs
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Optionally, set levels for specific loggers
logging.getLogger('app.main').setLevel(logging.DEBUG)
logging.getLogger('app.services').setLevel(logging.INFO)

# Load environment variables from .env
load_dotenv()

# PayPal Credentials
PAYPAL_API_BASE = os.getenv("PAYPAL_API_BASE", "https://api-m.sandbox.paypal.com")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET  = os.getenv("PAYPAL_CLIENT_SECRET")
# config.py mein ya main file ke top par
ENVIRONMENT = os.getenv('ENVIRONMENT', 'production').lower()
IS_DEVELOPMENT = ENVIRONMENT == 'development'

print(f"ENVIRONMENT: {ENVIRONMENT}")  # Debug ke liye
print(f"IS_DEVELOPMENT: {IS_DEVELOPMENT}")  # Debug ke liye

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

# Add this check
if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET or not RAZORPAY_WEBHOOK_SECRET:
    raise ValueError("Razorpay credentials (KEY_ID, KEY_SECRET, and WEBHOOK_SECRET) must be set in the environment variables")

# Add this after loading environment variables
logger = logging.getLogger(__name__)
logger.info("Payment gateway configuration loaded successfully")

# Validation add karein
if not NGROK_URL:
    raise ValueError("NGROK_URL must be set in the environment variables")

logger.info(f"[CONFIG] NGROK_URL set to: {NGROK_URL}")
logger.info(f"[CONFIG] RAZORPAY_CALLBACK_URL set to: {RAZORPAY_CALLBACK_URL}")

# Payment status mapping
PAYMENT_STATUS_MAP = {
    'created': 'pending',
    'authorized': 'processing',
    'captured': 'completed',
    'failed': 'failed',
    'refunded': 'refunded'
}
