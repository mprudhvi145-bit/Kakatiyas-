
import React from 'react';
import { SectionTitle } from '../../components/ui/Shared';
import { ARTISANS } from '../../lib/constants';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Master Artisans | KAKATIYAS',
  description: 'Meet the master weavers and smiths behind our heritage collection.',
};

export default function Artisans() {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6">
      <SectionTitle title="Master Artisans" />
      <div className="grid md:grid-cols-3 gap-12">
        {ARTISANS.map(artisan => (
          <div key={artisan.id} className="text-center">
            <div className="relative rounded-full overflow-hidden w-48 h-48 mx-auto mb-6 border-4 border-stone-100">
              <Image 
                src={artisan.image} 
                alt={artisan.name} 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 192px"
              />
            </div>
            <h3 className="font-royal text-xl mb-2">{artisan.name}</h3>
            <p className="text-stone-500 uppercase text-xs tracking-widest mb-4">{artisan.region}</p>
            <p className="font-serif italic text-stone-600 text-sm">{artisan.story}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
