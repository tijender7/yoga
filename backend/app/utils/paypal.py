import requests
import logging
from base64 import b64encode

# Temporarily hardcode the credentials for testing
PAYPAL_CLIENT_ID = "AWIElPGQNAuNq7pL4HRgO_AsWWUGqQ5AOuWjfuEMv-XNFRkpKxXIaSxFmGpfrkaKKjN3T2lCFfUsq2l"
PAYPAL_CLIENT_SECRET = "EG39FluJWWbkcPZVUM82_DXsKDTrsJlSJHMPsXQdHHrS4Umx95M-5kfrQb2j2RhJgcL2M317lytSTILa"
PAYPAL_BASE_URL = "https://api.sandbox.paypal.com"

# Set up logging to print logs in the console
logging.basicConfig(level=logging.INFO)

def get_paypal_access_token():
    logging.info("Attempting to get PayPal access token...")
    logging.info(f"Client ID: {PAYPAL_CLIENT_ID}")
    logging.info(f"Client Secret: {PAYPAL_CLIENT_SECRET[:6]}****")  # Mask most of the secret for security
    
    # Construct the Base64-encoded Authorization header
    auth_string = f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}"
    auth_bytes = auth_string.encode("utf-8")
    auth_header = b64encode(auth_bytes).decode("utf-8")

    url = f"{PAYPAL_BASE_URL}/v1/oauth2/token"
    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "Accept-Language": "en_US"
    }
    data = {
        "grant_type": "client_credentials"
    }

    # Log the request details
    logging.info(f"Sending POST request to {url}")
    logging.info(f"Headers: {headers}")

    # Send the request to PayPal
    response = requests.post(url, headers=headers, data=data)
    
    # Log the response from PayPal
    logging.info(f"Response Status Code: {response.status_code}")
    logging.info(f"Response Content: {response.content}")
    
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        raise Exception(f"Failed to get PayPal access token: {response.json()}")
