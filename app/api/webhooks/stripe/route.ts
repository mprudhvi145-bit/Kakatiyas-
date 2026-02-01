
import { NextResponse } from 'next/server';
import { stripe } from '../../../../lib/payments/stripe';
import { db } from '../../../../lib/db';
import { OrderStatus } from '../../../../types/index';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await db.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID }
      });
      console.log(`Order ${orderId} marked as PAID via Stripe.`);
    }
  }

  return NextResponse.json({ received: true });
}
