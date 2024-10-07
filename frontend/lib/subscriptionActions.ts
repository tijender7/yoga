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

    console.log('[RESPONSE] Status:', response.status);
    const responseText = await response.text();
    console.log('[RESPONSE] Text:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('[SUCCESS] Subscription API response:', data);

    if (data.status === 'success') {
      console.log('[SUCCESS] Subscription created successfully');
      await openRazorpayCheckout(data.subscription_id, data.razorpay_key);
      return data.payment_link;
    } else {
      console.error('[ERROR] Subscription creation failed:', data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('[ERROR] Error in subscription process:', error);
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