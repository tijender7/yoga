import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# PayPal Credentials
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID").strip()
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET").strip()
PAYPAL_BASE_URL = os.getenv("PAYPAL_BASE_URL", "https://api.sandbox.paypal.com")

# Log loaded credentials for debugging
logging.info(f"Loaded PayPal Client ID: {PAYPAL_CLIENT_ID}")
logging.info(f"Loaded PayPal Client Secret: {PAYPAL_CLIENT_SECRET[:6]}****")  # Mask most of the secret for safety


# Supabase credentials (existing setup)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
    raise ValueError("PayPal Client ID and Secret must be set in the environment variables")

# Initialize Supabase client (assuming you have Supabase set up this way)
from supabase import create_client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
