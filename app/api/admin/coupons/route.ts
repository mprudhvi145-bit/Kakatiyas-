
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { requireAdmin } from '../../../../lib/auth-guard';

export async function GET() {
  await requireAdmin();
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(coupons);
}

export async function POST(req: Request) {
  await requireAdmin();
  try {
    const body = await req.json();
    const { code, discount, expiresAt } = body;

    if (!code || !discount) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount: Number(discount),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error('Create Coupon Error', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
