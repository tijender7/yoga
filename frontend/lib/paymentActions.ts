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

const formatAmountForCurrency = (amount: number, currency: string) => {
  // Amount should already be in the smallest currency unit (cents/paise)
  switch(currency) {
    case 'INR':
      return Math.round(amount * 100); // Convert to paise
    case 'USD':
    case 'EUR':
      // Convert dollars/euros to cents
      return Math.round(amount * 100);
    default:
      throw new Error(`Unsupported currency: ${currency}`);
  }
};

export async function handlePayment(amount: number, currency: string = 'INR', userId?: string) {
    try {
        // Store userId in localStorage before payment
        if (userId) {
            localStorage.setItem('temp_payment_user_id', userId);
        }
        
        const formattedAmount = formatAmountForCurrency(amount, currency);
        
        // Add logging
        console.log(`Processing payment: ${amount} ${currency} -> ${formattedAmount}`);
        
        const response = await fetch(`${API_BASE_URL}/api/create-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: formattedAmount,
                currency,
                user_id: userId 
            })
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


