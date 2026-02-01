
import React from 'react';
import { SectionTitle } from '../../components/ui/Shared';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Heritage | KAKATIYAS',
  description: 'Rooted in centuries-old techniques, we collaborate with master artisans to create heirlooms that transcend time.',
};

export default function About() {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6 text-center">
      <SectionTitle title="Our Heritage" />
      <p className="max-w-2xl mx-auto text-lg text-stone-600 font-serif leading-relaxed">
        We work directly with artisan families in Warangal, Pochampally, and Gadwal. 
        Our mission is to sustain the complex art forms of the Kakatiya region through modern patronage.
      </p>
    </div>
  );
}
