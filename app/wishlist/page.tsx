
import React from 'react';
import { db } from '../../lib/db';
import { requireAuth } from '../../lib/auth-guard';
import { SectionTitle, Button } from '../../components/ui/Shared';
import { ProductCard } from '../../components/ui/ProductCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Wishlist | KAKATIYAS',
  description: 'View your saved heritage pieces.',
};

export default async function WishlistPage() {
  const session = await requireAuth();

  const items = await db.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { images: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="pt-32 pb-20 container mx-auto px-6">
      <SectionTitle title="Your Wishlist" />

      {items.length === 0 ? (
        <div className="text-center">
          <p className="font-serif text-stone-600 mb-8">Your wishlist is currently empty.</p>
          <Link href="/shop">
            <Button>Explore Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
