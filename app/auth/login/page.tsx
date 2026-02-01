
import React from 'react';
import { Button } from '../../../components/ui/Shared';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | KAKATIYAS',
  description: 'Access your account to manage orders and view your wishlist.',
};

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-kakatiya-base">
      <div className="bg-white p-12 shadow-lg border border-stone-100 max-w-md w-full text-center">
        <h1 className="font-royal text-2xl mb-2">KAKATIYAS</h1>
        <p className="text-xs uppercase tracking-widest text-stone-500 mb-8">Member Access</p>
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full border border-stone-200 p-4 text-sm outline-none focus:border-kakatiya-gold transition-colors"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full border border-stone-200 p-4 text-sm outline-none focus:border-kakatiya-gold transition-colors"
          />
          <Button className="w-full">Sign In</Button>
        </div>
        <p className="mt-6 text-xs text-stone-400">
          Forgot password? <span className="underline cursor-pointer">Reset here</span>
        </p>
      </div>
    </div>
  );
}
