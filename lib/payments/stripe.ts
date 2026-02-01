
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

// Generate a payment link for WhatsApp
export const createStripePaymentLink = async (amount: number, orderId: string) => {
  // Use checkout sessions for a link-based flow without needing frontend elements
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'inr',
        product_data: {
          name: `Order #${orderId.slice(-6)} - Kakatiyas`,
        },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/profile/orders/${orderId}?status=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/profile/orders/${orderId}?status=cancel`,
    metadata: {
      orderId: orderId,
      source: 'WHATSAPP'
    }
  });

  return session.url;
};
