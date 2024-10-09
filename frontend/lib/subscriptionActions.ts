import { supabase } from './supabase'
import { loadRazorpay } from './razorpayLoader'; 
import { API_BASE_URL } from '../config';// Ye function hum agle step mein create karenge

export async function handleSubscribeNow(userId: string, planType: string, region: string) {
  console.log(`[START] Subscribe button clicked for user: ${userId}, plan type: ${planType}, region: ${region}`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId: userId, planType: planType, region: region }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[SUCCESS] Subscription created:', data);

    console.log('[WEBHOOK] Subscription created, waiting for webhook event');

    if (data.status === 'success' && data.payment_link) {
      const Razorpay = await loadRazorpay();
      const options = {
        key: data.razorpay_key,
        subscription_id: data.subscription_id,
        name: "YogaHarmony",
        description: `${planType} Subscription`,
        handler: async function (response: any) {
          console.log('[SUCCESS] Payment initiated:', response);
          alert('Payment initiated. We will update you once it is confirmed.');
          await pollSubscriptionStatus(userId);
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert('Payment failed. Please try again.');
      });
      rzp.open();
    } else {
      throw new Error('Failed to create subscription');
    }
  } catch (error) {
    console.error('[ERROR] Error in handleSubscribeNow:', error);
    throw error;
  }
}

async function openRazorpayCheckout(subscriptionId: string, razorpayKey: string) {
  console.log('[START] Opening Razorpay checkout for subscription:', subscriptionId);
  const Razorpay = await loadRazorpay();
  
  const options = {
    key: razorpayKey,
    subscription_id: subscriptionId,
    name: "Yoga Classes",
    description: "Subscription Payment",
    handler: function (response: any) {
      console.log('[SUCCESS] Payment successful:', response);
      alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
  console.log('[END] Razorpay checkout opened');
}



export async function checkSubscriptionStatus(userId: string) {
  console.log(`[START] Checking subscription status for user: ${userId}`);
  try {
    const response = await fetch(`${API_BASE_URL}/api/check-subscription-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    console.log(`[INFO] Response status: ${response.status}`);

    const data = await response.json();
    console.log(`[INFO] Response data:`, data);

    if (response.ok) {
      console.log(`[SUCCESS] Subscription status: ${data.subscription_status}`);
      return data.subscription_status;
    } else {
      console.error(`[ERROR] HTTP error! status: ${response.status}, message: ${data.message}`);
      return 'error';
    }
  } catch (error) {
    console.error('[ERROR] Error checking subscription status:', error);
    return 'error';
  }
}



// Naya function add karte hain
export async function fetchYogaPricing(region: string) {
    const { data, error } = await supabase
      .from('yoga_pricing')
      .select('id, region, plan_type, monthly_price, total_price, savings, currency, strike_price, discounted_monthly_price, discount_percentage')
      .eq('region', region)
  
    if (error) {
      console.error('Error fetching yoga pricing:', error)
      return []
    }
  
    return data
  }

 

async function insertSubscriptionDetails(userId: string, subscriptionId: string, planType: string, region: string, razorpayPlanId: string) {
  console.log(`[START] Inserting subscription details for user: ${userId}`);
  try {
    const response = await fetch(`${API_BASE_URL}/api/insert-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, subscriptionId, planType, region, razorpayPlanId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[SUCCESS] Subscription details inserted: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error('[ERROR] Failed to insert subscription details:', error);
    return { status: 'error' };
  }
}

async function pollSubscriptionStatus(userId: string, maxAttempts = 12) {
  console.log(`[START] Polling subscription status for user: ${userId}`);
  let attempts = 0;
  while (attempts < maxAttempts) {
    const status = await checkSubscriptionStatus(userId);
    console.log(`[POLL] Attempt ${attempts + 1}: Status - ${status}`);
    if (status === 'active') {
      console.log('[SUCCESS] Subscription is now active');
      return status;
    }
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
  }
  console.log('[WARNING] Max polling attempts reached. Subscription may still be pending.');
  return 'pending';
}