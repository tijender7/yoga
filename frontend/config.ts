// frontend/config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const RAZORPAY_CALLBACK_URL = `${API_BASE_URL}/api/payment-webhook`;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL environment variable is not set');
}