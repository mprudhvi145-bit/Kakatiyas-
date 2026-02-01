
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { CURRENCY } from '../../lib/constants';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  const isAdmin = pathname?.startsWith('/admin');
  const isAuth = pathname?.startsWith('/auth');

  // If Admin or Auth, render children without the standard luxury header/footer
  if (isAdmin || isAuth) {
    return <main className="min-h-screen bg-stone-50">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-kakatiya-base">
      {/* Promo Bar */}
      <div className="bg-stone-900 text-stone-200 text-[10px] uppercase tracking-[0.2em] text-center py-2">
        Complimentary Shipping on Global Orders Over {CURRENCY}50,000
      </div>

      <Header />

      {/* Content */}
      <main className="flex-grow pt-[32px]">
        {children}
      </main>

      <Footer />
    </div>
  );
};
