import React from 'react';
import { loadRazorpay } from '@/lib/razorpayLoader';

interface SmartPaymentButtonProps {
  currency: string;
  amount: number;
  onSuccess: (response: any) => void;
  razorpayKey: string;
  razorpaySubscriptionId: string;
  className?: string;
  children: React.ReactNode;
}

const SmartPaymentButton: React.FC<SmartPaymentButtonProps> = ({
  currency,
  amount,
  onSuccess,
  razorpayKey,
  razorpaySubscriptionId,
  className,
  children
}) => {
  const handlePayment = async () => {
    console.log('handlePayment called');
    try {
      const Razorpay = await loadRazorpay();
      console.log('Razorpay loaded');
      const options = {
        key: razorpayKey,
        subscription_id: razorpaySubscriptionId,
        name: "YogForever",
        description: "Subscription Payment",
        handler: function (response: any) {
          console.log('Payment successful', response);
          onSuccess(response);
        },
        prefill: {
          name: "Yoga Student",
          email: "student@example.com"
        },
        theme: {
          color: "#3399cc"
        }
      };
      console.log('Razorpay options', options);
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error in handlePayment', error);
    }
  };

  return (
    <button onClick={handlePayment} className={className}>
      {children}
    </button>
  );
};

export default SmartPaymentButton;
