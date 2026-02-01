import React from 'react';
import { SectionTitle, Button } from '../../components/ui/Shared';

export default function Checkout() {
  return (
    <div className="pt-32 pb-20 container mx-auto px-6 max-w-2xl text-center">
      <SectionTitle title="Secure Checkout" />
      <div className="bg-stone-50 p-12 border border-stone-200">
        <p className="font-serif text-stone-600 mb-8">
          Checkout functionality is being integrated with our secure payment partners (Stripe & Razorpay).
        </p>
        <Button variant="primary">Return to Shop</Button>
      </div>
    </div>
  );
}
