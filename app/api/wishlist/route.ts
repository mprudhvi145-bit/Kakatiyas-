
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { getServerSessionSafe } from '../../../lib/auth';

export async function GET() {
  const session = await getServerSessionSafe();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const wishlist = await db.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { images: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(wishlist);
}

export async function POST(req: Request) {
  const session = await getServerSessionSafe();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const item = await db.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      }
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
       return NextResponse.json({ message: 'Already in wishlist' }, { status: 200 });
    }
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSessionSafe();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    await db.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
        productId: productId
      }
    });

    return NextResponse.json({ message: 'Removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove' }, { status: 500 });
  }
}
