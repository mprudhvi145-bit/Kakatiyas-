
import React from 'react';
import { db } from '../../lib/db';
import { SectionTitle } from '../../components/ui/Shared';
import { ProductCard } from '../../components/ui/ProductCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: 'The Treasury | Shop Collection',
  description: 'Explore our curated collection of luxury handloom, jewelry, and fashion.',
};

export default async function Shop() {
  const products = await db.product.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await db.category.findMany();

  return (
    <div className="pt-40 pb-32 container mx-auto px-6 md:px-12">
      <SectionTitle title="The Treasury" subtitle="Select Collection" />
      
      {/* Category Links */}
      <div className="flex flex-wrap justify-center gap-10 mb-20 border-b border-stone-200 pb-8">
        <Link 
          href="/shop"
          className="uppercase text-[11px] tracking-[0.2em] font-bold text-kakatiya-gold"
        >
          All Collections
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}`}
            className="uppercase text-[11px] tracking-[0.2em] font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-20 text-stone-400 font-serif italic text-lg">
            Our treasury is currently being restocked.
          </div>
        )}
      </div>
    </div>
  );
}
