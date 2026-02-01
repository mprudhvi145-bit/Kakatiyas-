
import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const createRazorpayOrder = async (amount: number, orderId: string) => {
  const options = {
    amount: Math.round(amount * 100), // amount in paise
    currency: "INR",
    receipt: orderId,
    notes: {
        orderId: orderId
    }
  };

  try {
    const response = await razorpay.orders.create(options);
    return response;
  } catch (error) {
    console.error("Razorpay Error:", error);
    throw new Error("Razorpay order creation failed");
  }
};

export const createRazorpayPaymentLink = async (amount: number, orderId: string, customerPhone: string) => {
  try {
    const response = await razorpay.paymentLink.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      accept_partial: false,
      reference_id: orderId,
      description: `Payment for Order #${orderId.slice(-6)}`,
      customer: {
        contact: customerPhone,
        email: "guest@kakatiyas.com" // Placeholder for WA
      },
      notify: {
        sms: true,
        email: false
      },
      reminder_enable: true,
      notes: {
        orderId: orderId,
        source: 'WHATSAPP'
      }
    });
    return response.short_url;
  } catch (error) {
    console.error("Razorpay Link Error:", error);
    throw new Error("Razorpay link creation failed");
  }
};
