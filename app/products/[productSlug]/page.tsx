
import React from 'react';
import { db } from '../../../lib/db';
import { notFound } from 'next/navigation';
import { CURRENCY } from '../../../lib/constants';
import { AddToCartButton } from '../../../components/ui/AddToCartButton';
import { SectionTitle } from '../../../components/ui/Shared';
import Image from 'next/image';
import { Metadata } from 'next';

export const revalidate = 60;

interface ProductPageProps {
  params: { productSlug: string };
}

// Dynamic Metadata
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { slug: params.productSlug },
    include: { category: true }
  });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.productSlug },
    include: {
      images: true,
      category: true,
      artisan: true,
    }
  });

  if (!product) notFound();

  const mainImage = product.images[0]?.url || 'https://placehold.co/800x1000?text=No+Image';

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map(img => img.url),
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Kakatiyas'
    },
    offers: {
      '@type': 'Offer',
      url: `https://kakatiyas.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  };

  return (
    <div className="pt-40 pb-20 container mx-auto px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Product Images - Left (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-50 w-full relative overflow-hidden aspect-[4/5]">
             <Image 
               src={mainImage} 
               alt={product.name} 
               fill
               priority
               className="object-cover"
               sizes="(max-width: 1024px) 100vw, 60vw"
             />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <div key={idx} className="aspect-square bg-stone-50 cursor-pointer border border-transparent hover:border-kakatiya-gold/50 transition-colors relative">
                <Image 
                  src={img.url} 
                  alt={`${product.name} view ${idx + 1}`} 
                  fill
                  className="object-cover opacity-80 hover:opacity-100 transition-opacity"
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info - Right (5 cols) - Sticky */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32">
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-kakatiya-gold font-bold">
                {product.category?.name} — {product.type}
              </span>
            </div>
            
            <h1 className="font-royal text-4xl lg:text-5xl text-stone-900 mb-6 leading-tight">{product.name}</h1>
            <p className="font-serif text-3xl text-stone-800 mb-10 font-light">{CURRENCY}{product.price.toLocaleString()}</p>
            
            <div className="prose prose-stone prose-lg mb-12 text-stone-600 font-serif leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="space-y-8 border-t border-stone-200 pt-10">
               <AddToCartButton product={product} />
               
               <div className="flex gap-8 text-[10px] uppercase tracking-widest text-stone-500 pt-4">
                  <span className="flex items-center gap-2">Authentic Craft</span>
                  <span className="flex items-center gap-2">Global Shipping</span>
                  <span className="flex items-center gap-2">Secure Checkout</span>
               </div>
            </div>

            {/* Artisan Story Mini-Block */}
            {product.artisan && (
              <div className="mt-16 bg-stone-50 p-8 border border-stone-100 text-center lg:text-left">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-2">Crafted By</p>
                <h3 className="font-royal text-xl text-stone-900 mb-2">{product.artisan.name}</h3>
                <p className="text-xs text-stone-500 uppercase tracking-widest mb-4">{product.artisan.region}</p>
                <p className="font-serif italic text-stone-600 text-sm leading-relaxed">
                  "{product.artisan.story}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended / Story Section */}
      <div className="mt-32 border-t border-stone-200 pt-20">
        <SectionTitle title="Care Instructions" subtitle="Preserve The Legacy" />
        <div className="grid md:grid-cols-3 gap-12 text-center max-w-4xl mx-auto">
           <div>
             <h4 className="font-royal text-lg mb-4">Storage</h4>
             <p className="font-serif text-stone-600 text-sm">Store in a cool, dry place wrapped in muslin cloth to let the fabric breathe.</p>
           </div>
           <div>
             <h4 className="font-royal text-lg mb-4">Cleaning</h4>
             <p className="font-serif text-stone-600 text-sm">Dry clean only to maintain the integrity of the gold zari and natural dyes.</p>
           </div>
           <div>
             <h4 className="font-royal text-lg mb-4">Handling</h4>
             <p className="font-serif text-stone-600 text-sm">Avoid direct contact with perfumes or sprays. Handle with clean hands.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
