import { supabase } from './supabase'

import { API_BASE_URL } from '../config';// Ye function hum agle step mein create karenge

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

export async function handlePayment(amount: number, currency: string = 'INR') {
    try {
        const response = await fetch(`${API_BASE_URL}/api/create-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency })
        });

        if (!response.ok) {
            throw new Error('Payment creation failed');
        }

        const { payment_link } = await response.json();
        window.location.href = payment_link;
    } catch (error) {
        console.error('Payment failed');
        throw error;
    }
}


