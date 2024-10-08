import { supabase } from './supabase'
import { loadRazorpay } from './razorpayLoader'; // Ye function hum agle step mein create karenge

export async function handleSubscribeNow(userId: string, planType: string, region: string) {
  console.log(`[START] Subscribe button clicked for user: ${userId}, plan type: ${planType}, region: ${region}`);

  try {
    const response = await fetch('http://localhost:8000/api/create-subscription', {
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

    if (data.status === 'success' && data.payment_link) {
      const Razorpay = await loadRazorpay();
      const options = {
        key: data.razorpay_key,
        subscription_id: data.subscription_id,
        name: "YogaHarmony",
        description: `${planType} Subscription`,
        handler: async function (response: any) {
          console.log('[SUCCESS] Payment successful:', response);
          // Insert subscription details after successful payment
          const insertResult = await insertSubscriptionDetails(userId, data.subscription_id, planType, region, data.razorpay_plan_id);
          if (insertResult.status === 'success') {
            alert('Payment successful! Your subscription is now active.');
          } else {
            alert('Payment received. Your subscription will be activated soon.');
          }
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } else {
      throw new Error('Failed to create subscription');
    }
  } catch (error) {
    console.error('[ERROR] Error in handleSubscribeNow:', error);
    alert('An error occurred. Please try again.');
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
    const response = await fetch('http://localhost:8000/api/check-subscription-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    console.log(`[INFO] Response status: ${response.status}`);

    const data = await response.json();

    if (response.ok) {
      console.log(`[SUCCESS] Subscription status: ${data.subscription_status}`);
      return data.subscription_status;
    } else {
      console.error(`[ERROR] HTTP error! status: ${response.status}`);
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
    const response = await fetch('http://localhost:8000/api/insert-subscription', {
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