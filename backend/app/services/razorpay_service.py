import razorpay
from app.config import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
from app.db import supabase
import asyncio
import logging

logger = logging.getLogger(__name__)

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

async def create_or_get_razorpay_customer(user_id: str, max_retries=3):
    logger.info(f"Starting Razorpay customer creation/fetch for user {user_id}")
    for attempt in range(max_retries):
        try:
            # Check if customer already exists in our database
            existing_customer = supabase.table('razorpay_customers').select('razorpay_customer_id').eq('id', user_id).execute()
            if existing_customer.data:
                logger.info(f"Existing Razorpay customer found for user {user_id}")
                return existing_customer.data[0]['razorpay_customer_id']

            # If not, fetch user details and create new customer
            user_response = supabase.table('users').select('*').eq('id', user_id).execute()
            if not user_response.data:
                logger.error(f"User not found: {user_id}")
                return None

            user_data = user_response.data[0]
            name = user_data.get('full_name', '')
            email = user_data.get('email', '')

            if not email:
                logger.error(f"Email not found for user: {user_id}")
                return None

            logger.info(f"Creating Razorpay customer for user {user_id}")
            customer = client.customer.create({
                "name": name,
                "email": email,
            })
            logger.info(f"Razorpay customer creation response: {customer}")

            # Insert into razorpay_customers table
            result = supabase.table('razorpay_customers').insert({
                'id': user_id,
                'razorpay_customer_id': customer['id']
            }).execute()

            if result.error:
                logger.error(f"Error inserting razorpay customer: {result.error}")
                raise Exception(result.error)

            logger.info(f"Successfully created Razorpay customer for user {user_id}")
            return customer['id']
        except razorpay.errors.BadRequestError as e:
            if "Customer already exists" in str(e):
                logger.warning(f"Customer already exists for user {user_id}. Fetching existing customer.")
                try:
                    # Fetch user email from Supabase
                    user_response = supabase.table('users').select('email').eq('id', user_id).execute()
                    if user_response.data:
                        email = user_response.data[0]['email']
                        # Fetch customer from Razorpay using email
                        existing_customers = client.customer.all({"email": email})
                        if existing_customers['count'] > 0:
                            existing_customer_id = existing_customers['items'][0]['id']
                            # Update our database with the existing Razorpay customer ID
                            supabase.table('razorpay_customers').upsert({
                                'id': user_id,
                                'razorpay_customer_id': existing_customer_id
                            }).execute()
                            logger.info(f"Updated existing Razorpay customer ID for user {user_id}")
                            return existing_customer_id
                except Exception as fetch_error:
                    logger.error(f"Error fetching existing customer: {str(fetch_error)}")
            logger.error(f"Attempt {attempt + 1} failed: Error creating/fetching Razorpay customer for user {user_id}: {str(e)}")
        except Exception as e:
            logger.error(f"Attempt {attempt + 1} failed: Error creating/fetching Razorpay customer for user {user_id}: {str(e)}")
        
        if attempt == max_retries - 1:
            logger.error(f"All attempts failed for user {user_id}")
            return None
        await asyncio.sleep(2 ** attempt)  # Exponential backoff
    return None