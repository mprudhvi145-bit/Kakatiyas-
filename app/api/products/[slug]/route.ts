
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await db.product.findUnique({
      where: { slug: params.slug },
      include: {
        images: true,
        category: true,
        artisan: true,
      }
    });

    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
