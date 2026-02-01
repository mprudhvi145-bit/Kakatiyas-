
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AdminNav = () => {
  const pathname = usePathname();

  const links = [
    { name: 'Analytics', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Coupons', path: '/admin/coupons' },
    { name: 'Gift Cards', path: '/admin/giftcards' },
    { name: 'Artisans', path: '/admin/artisans' },
    { name: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-stone-900 text-white fixed h-full hidden md:block overflow-y-auto">
      <div className="p-8">
        <h2 className="font-royal text-xl tracking-widest mb-12">
          KAKATIYAS <span className="text-xs block text-stone-500 mt-2 font-sans">Admin Portal</span>
        </h2>
        <nav className="space-y-4">
          {links.map((link) => {
            const isActive = pathname === link.path; 
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`block w-full text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors ${
                  isActive ? 'bg-kakatiya-gold text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
