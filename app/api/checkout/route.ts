
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { getServerSessionSafe } from '../../../lib/auth';
import { createStripeIntent } from '../../../lib/payments/stripe';
import { createRazorpayOrder } from '../../../lib/payments/razorpay';
import { OrderStatus } from '../../../types/index';

export async function POST(req: Request) {
  const session = await getServerSessionSafe();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, paymentProvider, couponCode } = await req.json();

    const order = await db.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === OrderStatus.PAID) {
      return NextResponse.json({ error: 'Order already paid' }, { status: 400 });
    }

    // Handle Coupon
    let finalTotal = order.total;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode }
      });

      if (!coupon) {
        return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
      }

      if (!coupon.active) {
        return NextResponse.json({ error: 'Coupon is inactive' }, { status: 400 });
      }

      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
         return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
      }

      // Apply Discount
      const discountAmount = Math.round((finalTotal * coupon.discount) / 100);
      finalTotal = finalTotal - discountAmount;

      // Update Order with new total to persist the discount
      // NOTE: In a real system, we should likely store discount applied separately or create an OrderModification record
      // For this implementation, updating total directly.
      if (finalTotal !== order.total) {
        await db.order.update({
          where: { id: order.id },
          data: { total: finalTotal }
        });
      }
    }

    // Safety check
    if (finalTotal < 0) finalTotal = 0;

    if (paymentProvider === 'stripe') {
      const intent = await createStripeIntent(finalTotal, order.id);
      return NextResponse.json({ 
        clientSecret: intent.client_secret,
        id: intent.id,
        newTotal: finalTotal
      });
    } 
    
    if (paymentProvider === 'razorpay') {
      const razorpayOrder = await createRazorpayOrder(finalTotal, order.id);
      return NextResponse.json({
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        newTotal: finalTotal
      });
    }

    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
