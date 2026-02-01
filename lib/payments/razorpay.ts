
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
