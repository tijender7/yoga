import React, { useEffect, useRef } from 'react';

interface RazorpaySubscriptionButtonProps {
  subscriptionButtonId: string;
}

export default function RazorpaySubscriptionButton({ subscriptionButtonId }: RazorpaySubscriptionButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.razorpay.com/static/widget/subscription-button.js';
    script.async = true;
    script.dataset.subscription_button_id = subscriptionButtonId;
    script.dataset.button_theme = 'brand-color';
    
    if (buttonRef.current) {
      buttonRef.current.appendChild(script);
    }

    return () => {
      if (buttonRef.current && buttonRef.current.firstChild) {
        buttonRef.current.removeChild(buttonRef.current.firstChild);
      }
    };
  }, [subscriptionButtonId]);

  return (
    <div ref={buttonRef} className="w-full">
      <form className="rzp-button-form">
        {/* This empty form is required for Razorpay to properly inject the button */}
      </form>
    </div>
  );
}