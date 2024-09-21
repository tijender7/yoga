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

def deactivate_paypal_subscription_plan(access_token, plan_id):
    url = f"https://api.sandbox.paypal.com/v1/billing/plans/{plan_id}/deactivate"  # Use 'api.paypal.com' for live mode
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.post(url, headers=headers)
    
    if response.status_code == 204:  # PayPal returns 204 No Content for successful deactivation
        print(f"Plan {plan_id} deactivated successfully.")
    else:
        raise Exception(f"Failed to deactivate plan {plan_id}: {response.json()}")

if __name__ == "__main__":
    try:
        # Step 1: Get access token
        access_token = get_paypal_access_token()
        print(f"Access token: {access_token}")

        # Step 2: Deactivate duplicate plans (replace with your actual plan IDs)
        duplicate_plan_ids = [
            "P-0FR14219HK0409105M3WZUNI",  # 1-Month Duplicate
            "P-0XE99248WA8232131M3WZUNI",  # 6-Month Duplicate
            "P-34U00416RW404443GM3WZUNQ"   # 12-Month Duplicate
        ]

        # Deactivate each duplicate plan
        for plan_id in duplicate_plan_ids:
            deactivate_paypal_subscription_plan(access_token, plan_id)

    except Exception as e:
        print(f"Error: {e}")
