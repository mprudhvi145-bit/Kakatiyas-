
"use client";

import React, { useState } from 'react';
import { useCart } from '../../components/providers/CartProvider';
import { SectionTitle, Button } from '../../components/ui/Shared';
import { useRouter } from 'next/navigation';
import { CURRENCY } from '../../lib/constants';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async (provider: 'stripe' | 'razorpay') => {
    setLoading(true);
    try {
      // 1. Create Order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });

      if (!orderRes.ok) throw new Error('Order creation failed');
      const { orderId } = await orderRes.json();

      // 2. Initiate Payment
      const paymentRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentProvider: provider }),
      });

      if (!paymentRes.ok) throw new Error('Payment initiation failed');
      const paymentData = await paymentRes.json();

      // 3. Handle Provider Specific Logic
      if (provider === 'razorpay') {
        const options = {
          key: paymentData.keyId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: "KAKATIYAS",
          description: "Luxury Heritage Purchase",
          order_id: paymentData.id,
          handler: function (response: any) {
             // In a real app, verify signature on server here
             // For now, assume success and clear cart
             clearCart();
             router.push(`/profile/orders/${orderId}`);
          },
          prefill: {
            name: "Guest User", // Should come from Auth
            email: "guest@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#C5A059"
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (provider === 'stripe') {
        // Redirect to a Stripe Elements page or handle here
        // For this phase, we'll just log success and mock redirect since we don't have Elements UI built
        alert("Stripe Intent Created: " + paymentData.id + ". Redirecting to success mock.");
        clearCart();
        router.push(`/profile/orders/${orderId}`);
      }

    } catch (error) {
      console.error(error);
      alert('Checkout Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <SectionTitle title="Checkout" />
        <p className="mb-4">Your cart is empty.</p>
        <Button onClick={() => router.push('/shop')}>Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 max-w-2xl">
      <SectionTitle title="Secure Checkout" />
      
      <div className="bg-white p-8 border border-stone-200 shadow-sm">
        <h3 className="font-royal text-xl mb-6">Order Summary</h3>
        <div className="space-y-4 mb-8">
          {cart.map((item) => (
             <div key={item.productId} className="flex justify-between text-sm">
               <span>{item.name} x {item.quantity}</span>
               <span className="font-serif">{CURRENCY}{item.price * item.quantity}</span>
             </div>
          ))}
          <div className="border-t border-stone-200 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="font-royal">{CURRENCY}{cartTotal}</span>
          </div>
        </div>

        <h3 className="font-royal text-xl mb-6">Payment Method</h3>
        <div className="space-y-4">
          <Button 
            className="w-full bg-[#111] hover:bg-[#333]"
            onClick={() => handleCheckout('stripe')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay with Card (Stripe)'}
          </Button>
          <Button 
            className="w-full bg-[#3399cc] hover:bg-[#2288bb] text-white border-none"
            onClick={() => handleCheckout('razorpay')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
          </Button>
        </div>
        <p className="text-xs text-center text-stone-400 mt-6">
          Your payment information is encrypted and secure.
        </p>
      </div>
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
}
