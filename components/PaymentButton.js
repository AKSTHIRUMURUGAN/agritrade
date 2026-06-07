'use client';

import { useState } from 'react';
import { useAuth } from '../app/contexts/AuthContext';
import { initiatePayment } from '../app/lib/razorpay';

export default function PaymentButton({
  amount,
  projectName,
  projectId,
  sharesOwned = 1,
  onPaymentSuccess,
  className = '',
  children,
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      alert('Please login to make a payment');
      return;
    }

    setLoading(true);

    try {
      await initiatePayment({
        amount,
        name: user.name || user.email,
        email: user.email,
        phone: user.phone || '',
        description: `Investment in ${projectName}`,
        onSuccess: async (response) => {
          // Record investment using the correct user.id (not user.uid)
          try {
            await fetch('/api/farmershare/invest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                farmerShareId: projectId,
                userId: user.id,
                userName: user.name || user.email,
                sharesOwned,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              }),
            });

            onPaymentSuccess && onPaymentSuccess(response);
            alert('Investment successful! Thank you for supporting our farmers.');
          } catch (error) {
            console.error('Error recording investment:', error);
            alert('Payment received but failed to record. Please contact support.');
          }

          setLoading(false);
        },
        onFailure: (error) => {
          if (error !== 'Payment cancelled') {
            console.error('Payment failed:', error);
            alert(`Payment failed: ${error}`);
          }
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? 'Processing...' : children || `Invest ₹${amount?.toLocaleString()}`}
    </button>
  );
}
