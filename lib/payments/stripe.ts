
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const createStripeIntent = async (amount: number, orderId: string) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'inr',
    metadata: {
      orderId,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
};
