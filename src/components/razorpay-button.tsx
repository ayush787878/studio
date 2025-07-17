
'use client';

import React, { useEffect, useRef } from 'react';

interface RazorpayButtonProps {
  paymentButtonId: string;
}

export const RazorpayButton: React.FC<RazorpayButtonProps> = ({ paymentButtonId }) => {
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formContainerRef.current && paymentButtonId) {
      // Clear any previous button to avoid duplicates on re-render
      formContainerRef.current.innerHTML = '';

      // Create the form element
      const form = document.createElement('form');

      // Create the script element
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
      script.setAttribute('data-payment_button_id', paymentButtonId);
      script.async = true;

      // Append the script to the form, and the form to the container
      form.appendChild(script);
      formContainerRef.current.appendChild(form);
    }
  }, [paymentButtonId]);

  return <div ref={formContainerRef} className="w-full" />;
};
