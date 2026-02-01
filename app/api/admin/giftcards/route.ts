
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { requireAdmin } from '../../../../lib/auth-guard';
import crypto from 'crypto';

export async function GET() {
  await requireAdmin();
  const cards = await db.giftCard.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(cards);
}

export async function POST(req: Request) {
  await requireAdmin();
  try {
    const body = await req.json();
    const { balance } = body;

    if (!balance) {
      return NextResponse.json({ error: 'Missing balance' }, { status: 400 });
    }

    // Generate random secure code
    const code = 'GC-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const card = await db.giftCard.create({
      data: {
        code,
        balance: Number(balance),
      }
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gift card' }, { status: 500 });
  }
}
