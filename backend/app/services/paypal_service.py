import requests
from app.utils.paypal import get_paypal_access_token
from app.config import PAYPAL_API_BASE, PAYPAL_CLIENT_ID, PAYPAL_SECRET

def create_paypal_subscription(plan_id, user_details):
    access_token = get_paypal_access_token()  # Get access token using the Base64-encoded auth header
    url = f"{PAYPAL_API_BASE}/v1/billing/subscriptions"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Construct subscription data
    data = {
        "plan_id": plan_id,
        "subscriber": {
            "name": {
                "given_name": user_details["first_name"],
                "surname": user_details["last_name"]
            },
            "email_address": user_details["email"]
        },
        "application_context": {
            "brand_name": "Your Yoga Brand",
            "locale": "en-US",
            "shipping_preference": "NO_SHIPPING",
            "user_action": "SUBSCRIBE_NOW"
        }
    }

    # Send subscription request to PayPal
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 201:
        return response.json()  # Successfully created subscription
    else:
        raise Exception(f"Failed to create PayPal subscription: {response.json()}")
