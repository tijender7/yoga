import { supabase } from './supabase';
import { API_BASE_URL } from '../config';

export async function handlePaymentSuccess(paymentId: string, orderId: string) {
  console.log(`[START] Handling payment success for paymentId: ${paymentId}, orderId: ${orderId}`);
  try {
    console.log(`[INFO] Sending verification request to backend`);
    const response = await fetch(`${API_BASE_URL}/api/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentId, orderId }),
    });

    if (!response.ok) {
      console.error(`[ERROR] HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[SUCCESS] Payment verified:', data);
    return data;
  } catch (error) {
    console.error('[ERROR] Error verifying payment:', error);
    throw error;
  }
}
