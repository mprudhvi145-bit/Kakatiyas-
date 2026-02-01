
import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/db';
import { requireAdmin } from '../../../../../lib/auth-guard';

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  await requireAdmin();
  try {
    const product = await db.product.findUnique({
      where: { id: params.productId },
      include: { images: true }
    });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { productId: string } }) {
  await requireAdmin();
  try {
    const body = await req.json();
    const { name, slug, description, price, stock, type, categoryId, images } = body;

    // Transaction to update product and replace images
    const product = await db.$transaction(async (prisma) => {
      // 1. Update basic fields
      const p = await prisma.product.update({
        where: { id: params.productId },
        data: {
          name, slug, description, price, stock, type, categoryId
        }
      });

      // 2. Handle images if provided
      if (images && Array.isArray(images)) {
        await prisma.productImage.deleteMany({
          where: { productId: params.productId }
        });
        await prisma.productImage.createMany({
          data: images.map((url: string) => ({
            productId: params.productId,
            url
          }))
        });
      }

      return p;
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Update Product Error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { productId: string } }) {
  await requireAdmin();
  try {
    // Delete images first (cascade usually handles this, but being safe)
    await db.productImage.deleteMany({ where: { productId: params.productId }});
    await db.product.delete({ where: { id: params.productId } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
