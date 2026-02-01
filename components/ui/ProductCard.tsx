
"use client";

import React from 'react';
import Link from 'next/link';
import { CURRENCY } from '../../lib/constants';
import { Product } from '../../types';
import Image from 'next/image';

interface ProductCardProps {
  product: Omit<Product, 'images'> & { images: { url: string }[] };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images[0]?.url || 'https://placehold.co/600x800?text=No+Image';

  return (
    <Link href={`/products/${product.slug}`} className="group cursor-pointer block">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
        <Image 
          src={mainImage} 
          alt={product.name} 
          fill
          className="object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
        
        {/* Hover Action */}
        <div className="absolute bottom-0 left-0 w-full bg-white text-center py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out border-t border-stone-100">
          <span className="uppercase text-[10px] tracking-[0.2em] font-bold text-stone-900">View Product</span>
        </div>
      </div>
      
      <div className="text-center space-y-2 px-2">
        <p className="text-[10px] text-stone-500 uppercase tracking-widest">{product.type}</p>
        <h3 className="font-royal text-lg text-stone-900 leading-snug group-hover:text-kakatiya-gold transition-colors">{product.name}</h3>
        <p className="font-serif italic text-stone-600 text-lg">{CURRENCY}{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
};
