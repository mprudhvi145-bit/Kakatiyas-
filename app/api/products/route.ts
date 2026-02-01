
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { ProductType } from '../../../types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get('category');
  const type = searchParams.get('type');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const where: any = {};

  if (categorySlug) {
    const category = await db.category.findUnique({ where: { slug: categorySlug } });
    if (category) {
      where.categoryId = category.id;
    }
  }

  if (type && Object.values(ProductType).includes(type as ProductType)) {
    where.type = type;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseInt(minPrice);
    if (maxPrice) where.price.lte = parseInt(maxPrice);
  }

  try {
    const products = await db.product.findMany({
      where,
      include: {
        images: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
