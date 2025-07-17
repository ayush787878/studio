
"use client";

import React, { useEffect, useRef } from 'react';

interface PaymentButtonProps {
  paypalFormHtml?: string;
  razorpayButtonId?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ paypalFormHtml, razorpayButtonId }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    if (razorpayButtonId) {
        const form = document.createElement('form');
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/payment-button.js";
        script.setAttribute('data-payment_button_id', razorpayButtonId);
        script.async = true;
        
        form.appendChild(script);
        container.appendChild(form);
    } else if (paypalFormHtml) {
        container.innerHTML = paypalFormHtml;
    }

  }, [paypalFormHtml, razorpayButtonId]);

  return <div ref={containerRef} />;
};

export { PaymentButton };
