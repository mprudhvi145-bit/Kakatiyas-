import React from 'react';
import { CartItem } from '../types';
import { CURRENCY } from '../lib/constants';
import { SectionTitle, Button } from '../components/ui/Shared';
import { Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: string, q: number) => void;
  removeFromCart: (id: string) => void;
}

export default function Cart({ cart, updateQuantity, removeFromCart }: CartProps) {
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <h2 className="font-royal text-2xl text-stone-400">Your shopping bag is empty.</h2>
        <Button onClick={() => window.history.back()} variant="outline">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
      <SectionTitle title="Shopping Bag" />
      <div className="flex flex-col gap-8">
        {cart.map((item) => (
          <div key={`${item.id}-${item.variantId}`} className="flex gap-6 border-b border-stone-100 pb-8">
            <div className="w-24 h-32 bg-stone-100 flex-shrink-0">
              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-royal text-lg text-stone-900">{item.name}</h3>
                  <p className="font-serif text-stone-600">{CURRENCY}{(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">{item.category}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center border border-stone-200">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-stone-50"><Minus size={14} /></button>
                  <span className="px-4 text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-stone-50"><Plus size={14} /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 text-sm underline">Remove</button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="bg-stone-50 p-8 mt-8 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-stone-600">Subtotal</span>
            <span className="font-bold">{CURRENCY}{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-600">Shipping</span>
            <span className="text-stone-600">Calculated at checkout</span>
          </div>
          <div className="border-t border-stone-200 pt-4 flex justify-between text-lg font-royal">
            <span>Total</span>
            <span>{CURRENCY}{total.toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="block w-full">
            <Button className="w-full mt-4">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
