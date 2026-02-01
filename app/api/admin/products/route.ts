
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { requireAdmin } from '../../../../lib/auth-guard';

export async function GET() {
  await requireAdmin();
  const products = await db.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await requireAdmin();
  try {
    const body = await req.json();
    const { name, slug, description, price, stock, type, categoryId, images } = body;

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        type,
        categoryId,
        images: {
          create: images && Array.isArray(images) 
            ? images.map((url: string) => ({ url }))
            : []
        }
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create Product Error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
