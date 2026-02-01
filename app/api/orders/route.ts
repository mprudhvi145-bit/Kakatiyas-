
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { getServerSessionSafe } from '../../../lib/auth';
import { OrderStatus } from '../../../types/index';

export async function POST(req: Request) {
  const session = await getServerSessionSafe();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { items } = body; // items: [{ productId, quantity }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Use transaction for inventory safety
    const order = await db.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        // Deduct Stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        });
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          status: OrderStatus.PENDING,
          total,
          items: {
            create: orderItemsData
          }
        }
      });

      return newOrder;
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
