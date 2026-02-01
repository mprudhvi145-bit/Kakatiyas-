
import React from 'react';
import { db } from '../../../lib/db';
import { SectionTitle } from '../../../components/ui/Shared';
import { ProductCard } from '../../../components/ui/ProductCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function CategoryShop({ params }: { params: { categorySlug: string } }) {
  const category = await db.category.findUnique({
    where: { slug: params.categorySlug }
  });

  if (!category) notFound();

  const products = await db.product.findMany({
    where: { categoryId: category.id },
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await db.category.findMany();

  return (
    <div className="pt-24 pb-20 container mx-auto px-6">
      <SectionTitle title={category.name} subtitle="Collection" />
      
      <div className="flex justify-center gap-8 mb-16 border-b border-stone-200 pb-4">
        <Link 
          href="/shop"
          className="uppercase text-xs tracking-widest pb-4 text-stone-500 hover:text-stone-800 transition-colors"
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}`}
            className={`uppercase text-xs tracking-widest pb-4 transition-colors ${
              cat.slug === params.categorySlug 
                ? 'text-kakatiya-gold border-b-2 border-kakatiya-gold' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-20 text-stone-500">
            No products found in this collection.
          </div>
        )}
      </div>
    </div>
  );
}
