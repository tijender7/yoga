import requests
from requests.auth import HTTPBasicAuth

# Replace with your PayPal credentials
# Replace with your PayPal credentials
CLIENT_ID = "AWIElPGQNAuNq7pL4HRgO_AsWWUGqQ5AOuWjfuEMv-XNFRkpKxXIaSxFmGpfrkaKKjN3T2lCFfUsq2ll"
CLIENT_SECRET = "EG39FluJWWbkcPZVUM82_DXsKDTrsJlSJHMPsXQdHHrS4Umx95M-5kfrQb2j2RhJgcL2M317lytSTILa"


# Use the product_id from your previously created product
PRODUCT_ID = "PROD-7N661258LU720551K"


def get_paypal_access_token():
    url = "https://api.sandbox.paypal.com/v1/oauth2/token"  # Use 'api.paypal.com' for live
    headers = {
        "Accept": "application/json",
        "Accept-Language": "en_US"
    }
    data = {
        "grant_type": "client_credentials"
    }
    auth = HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    
    response = requests.post(url, headers=headers, data=data, auth=auth)
    
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        raise Exception(f"Failed to get access token: {response.json()}")

def create_paypal_subscription_plan(access_token, interval_count, price, plan_name):
    url = "https://api.sandbox.paypal.com/v1/billing/plans"  # Use 'api.paypal.com' for live
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    
    data = {
        "product_id": PRODUCT_ID,
        "name": plan_name,
        "description": f"Yoga subscription plan for {interval_count} months",
        "billing_cycles": [
            {
                "frequency": {
                    "interval_unit": "MONTH",
                    "interval_count": 1  # Monthly payment interval
                },
                "tenure_type": "REGULAR",
                "sequence": 1,
                "total_cycles": interval_count,  # Number of months
                "pricing_scheme": {
                    "fixed_price": {
                        "value": price,
                        "currency_code": "EUR"
                    }
                }
            }
        ],
        "payment_preferences": {
            "auto_bill_outstanding": True,
            "setup_fee": {
                "value": "0",
                "currency_code": "EUR"
            },
            "setup_fee_failure_action": "CONTINUE",
            "payment_failure_threshold": 3
        },
        "taxes": {
            "percentage": "0",
            "inclusive": False
        }
    }

    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 201:
        return response.json()
    else:
        raise Exception(f"Failed to create subscription plan: {response.json()}")

if __name__ == "__main__":
    try:
        # Step 1: Get access token
        access_token = get_paypal_access_token()
        print(f"Access token: {access_token}")

        # Step 2: Create subscription plans with updated prices
        one_month_plan = create_paypal_subscription_plan(access_token, 1, "45.00", "Yoga 1-Month Subscription")
        six_month_plan = create_paypal_subscription_plan(access_token, 6, "70.00", "Yoga 6-Month Subscription")
        twelve_month_plan = create_paypal_subscription_plan(access_token, 12, "45.00", "Yoga 12-Month Subscription")

        # Step 3: Print the details of each plan
        print("1-Month Plan created:", one_month_plan)
        print("6-Months Plan created:", six_month_plan)
        print("12-Month Plan created:", twelve_month_plan)

    except Exception as e:
        print(f"Error: {e}")