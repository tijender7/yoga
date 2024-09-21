import requests
from requests.auth import HTTPBasicAuth

# Replace with your PayPal credentials
CLIENT_ID = "AWIElPGQNAuNq7pL4HRgO_AsWWUGqQ5AOuWjfuEMv-XNFRkpKxXIaSxFmGpfrkaKKjN3T2lCFfUsq2ll"
CLIENT_SECRET = "EG39FluJWWbkcPZVUM82_DXsKDTrsJlSJHMPsXQdHHrS4Umx95M-5kfrQb2j2RhJgcL2M317lytSTILa"

def get_paypal_access_token():
    url = "https://api.sandbox.paypal.com/v1/oauth2/token"  # Use 'api.paypal.com' for live mode
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

def list_paypal_subscription_plans(access_token):
    url = "https://api.sandbox.paypal.com/v1/billing/plans"  # Use 'api.paypal.com' for live mode
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to retrieve subscription plans: {response.json()}")

if __name__ == "__main__":
    try:
        # Step 1: Get access token
        access_token = get_paypal_access_token()
        print(f"Access token: {access_token}")

        # Step 2: Retrieve subscription plans
        plans = list_paypal_subscription_plans(access_token)
        print("Retrieved Subscription Plans:")
        print(plans)

    except Exception as e:
        print(f"Error: {e}")
