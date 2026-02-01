
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '../../../../lib/db';
import { OrderStatus } from '../../../../types/index';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature');
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !secret) {
     return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  // To be safe, we verify signature.
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const payload = JSON.parse(body);

  if (payload.event === 'payment.captured') {
    // We store orderId in notes.orderId when creating the order in lib/payments/razorpay.ts
    const orderId = payload.payload.payment.entity.notes?.orderId;
    
    if (orderId) {
      await db.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID }
      });
    }
  }

  return NextResponse.json({ status: 'ok' });
}
