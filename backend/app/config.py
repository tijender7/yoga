import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# PayPal Credentials
PAYPAL_CLIENT_ID = "AUMBzyFd-RHjMo2WJIaKKHNYs9DpPGcmBuog5LgeQvTBx3lb0HIjkGo1WFvrPU-AuAaMXwViP5Gnh_3t"
PAYPAL_SECRET = "EH5erEuw3mPOvBX60O9jJlg1lbFETONT1c_s_xTVP_hQrjvB9JwIW9N70xUw-fOMTEte8jY-dJrKkyN6"
PAYPAL_API_BASE = os.getenv("PAYPAL_BASE_URL", "https://api.sandbox.paypal.com")

# Log loaded credentials for debugging
logging.info(f"Loaded PayPal Client ID: {PAYPAL_CLIENT_ID}")
logging.info(f"Loaded PayPal Client Secret: {PAYPAL_SECRET[:6]}****")  # Mask most of the secret for safety


# Supabase credentials (existing setup)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not PAYPAL_CLIENT_ID or not PAYPAL_SECRET:
    raise ValueError("PayPal Client ID and Secret must be set in the environment variables")

# Razorpay credentials
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET")

# Add this check
if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET or not RAZORPAY_WEBHOOK_SECRET:
    raise ValueError("Razorpay credentials (KEY_ID, KEY_SECRET, and WEBHOOK_SECRET) must be set in the environment variables")
