export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount, currency = 'INR') => {
  try {
    const response = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency })
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

export const initiatePayment = async ({
  amount,
  currency = 'INR',
  name,
  email,
  phone,
  description,
  onSuccess,
  onFailure
}) => {
  const res = await loadRazorpay();

  if (!res) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  const order = await createRazorpayOrder(amount, currency);

  if (!order.id) {
    alert('Failed to create order. Please try again.');
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'AgriTrade',
    description: description || 'Investment in Agricultural Project',
    order_id: order.id,
    prefill: {
      name: name,
      email: email,
      contact: phone
    },
    theme: {
      color: '#16a34a'
    },
    handler: async function (response) {
      try {
        const verification = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });

        if (verification.success) {
          onSuccess && onSuccess(response);
        } else {
          onFailure && onFailure('Payment verification failed');
        }
      } catch (error) {
        onFailure && onFailure(error.message);
      }
    },
    modal: {
      ondismiss: function() {
        onFailure && onFailure('Payment cancelled');
      }
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};
