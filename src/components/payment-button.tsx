
"use client";

import React from 'react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Define the Razorpay type on the window object
declare global {
    interface Window {
      Razorpay: any;
    }
}

interface PaymentButtonProps {
  paypalFormHtml?: string;
  razorpayPlanId?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ paypalFormHtml, razorpayPlanId }) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const handleRazorpayPayment = () => {
    if (!razorpayPlanId) return;

    if (!userProfile) {
        toast({
            title: "Please Log In",
            description: "You must be logged in to make a purchase.",
            variant: "destructive",
        });
        return;
    }

    if (!window.Razorpay) {
      toast({
        title: "Payment Gateway Error",
        description: "Razorpay is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID
      subscription_id: razorpayPlanId,
      name: "Facelyze",
      description: "Token Purchase",
      image: "https://i.ibb.co/PGmC0pBK/Untitled-design-6.png",
      handler: function (response: any) {
        // You can handle the successful payment here
        // e.g., verify payment on your server, update user tokens
        toast({
          title: "Payment Successful!",
          description: "Your tokens will be updated shortly.",
        });
        console.log(response);
      },
      prefill: {
        name: userProfile.displayName,
        email: userProfile.email,
      },
      notes: {
        userId: userProfile.uid,
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (razorpayPlanId) {
    return (
        <div className='flex flex-col items-center gap-2'>
            <Button onClick={handleRazorpayPayment} className="w-full">
                Pay with Razorpay
            </Button>
            <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" className="h-6" />
        </div>
    );
  }

  if (paypalFormHtml) {
    return <div dangerouslySetInnerHTML={{ __html: paypalFormHtml }} />;
  }

  return null;
};

export { PaymentButton };
