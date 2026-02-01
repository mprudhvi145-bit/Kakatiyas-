
"use client";

import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-20">
          
          {/* Brand Story */}
          <div className="md:col-span-4 space-y-8">
            <h3 className="font-royal text-3xl text-white tracking-widest">KAKATIYAS</h3>
            <p className="font-serif text-stone-400 leading-loose text-lg max-w-sm">
              Rooted in centuries-old techniques, we collaborate with master artisans to create heirlooms that transcend time.
            </p>
          </div>

          {/* Links 1 */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-white uppercase tracking-[0.2em] text-[10px] font-bold mb-8">Collections</h4>
            <ul className="space-y-4 font-sans text-sm tracking-wide">
              <li><Link href="/shop?cat=FASHION" className="hover:text-kakatiya-gold transition-colors block py-1">Fashion</Link></li>
              <li><Link href="/shop?cat=JEWELRY" className="hover:text-kakatiya-gold transition-colors block py-1">Jewelry</Link></li>
              <li><Link href="/shop?cat=HANDLOOM" className="hover:text-kakatiya-gold transition-colors block py-1">Handloom</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="md:col-span-2">
            <h4 className="text-white uppercase tracking-[0.2em] text-[10px] font-bold mb-8">Support</h4>
            <ul className="space-y-4 font-sans text-sm tracking-wide">
              <li><a href="#" className="hover:text-kakatiya-gold transition-colors block py-1">Contact</a></li>
              <li><a href="#" className="hover:text-kakatiya-gold transition-colors block py-1">Care Guide</a></li>
              <li><a href="#" className="hover:text-kakatiya-gold transition-colors block py-1">Shipping</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
             <h4 className="text-white uppercase tracking-[0.2em] text-[10px] font-bold mb-8">Newsletter</h4>
             <p className="text-sm mb-6 text-stone-500">First access to new arrivals and artisan stories.</p>
             <div className="flex border-b border-stone-600 pb-2">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-transparent w-full outline-none text-white placeholder-stone-600 text-sm font-sans" 
                />
                <button className="uppercase text-[10px] font-bold text-white hover:text-kakatiya-gold transition-colors">Subscribe</button>
             </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-stone-600">
          <p>&copy; 2024 Kakatiyas Heritage. All Rights Reserved.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
