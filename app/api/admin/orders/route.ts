
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { requireAdmin } from '../../../../lib/auth-guard';

export async function GET() {
  await requireAdmin();
  const orders = await db.order.findMany({
    include: {
      user: {
        select: { name: true, email: true }
      },
      items: true
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(orders);
}
