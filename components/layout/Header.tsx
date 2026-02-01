
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, User, Search, Heart } from 'lucide-react';
import { useCart } from '../providers/CartProvider';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();
  
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Text color logic
  const isTransparent = isHome && !isScrolled;
  const textColor = isTransparent ? 'text-white' : 'text-stone-900';
  const logoColor = isTransparent ? 'text-white' : 'text-stone-900';
  const hoverColor = isTransparent ? 'hover:text-kakatiya-gold' : 'hover:text-kakatiya-gold';
  const borderColor = isScrolled ? 'border-stone-100' : 'border-transparent';
  const bgColor = isScrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-transparent';

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Artisans', path: '/artisans' },
    { name: 'Heritage', path: '/about' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${bgColor} ${borderColor} ${isScrolled ? 'py-4' : 'py-8'}`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Left Nav (Desktop) */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path} 
                className={`uppercase text-[11px] tracking-[0.2em] font-medium transition-colors ${textColor} ${hoverColor}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden ${textColor}`}>
            <Menu size={24} strokeWidth={1} />
          </button>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center group">
            <h1 className={`font-royal text-2xl md:text-4xl font-normal tracking-widest transition-colors ${logoColor}`}>
              KAKATIYAS
            </h1>
          </Link>

          {/* Right Icons */}
          <div className={`flex items-center gap-8 ${textColor}`}>
            <button className={`hidden md:block transition-colors ${hoverColor}`}>
              <Search size={20} strokeWidth={1} />
            </button>
            <Link href="/auth/login" className={`hidden md:block transition-colors ${hoverColor}`}>
              <User size={20} strokeWidth={1} />
            </Link>
            <Link href="/wishlist" className={`hidden md:block transition-colors ${hoverColor}`}>
              <Heart size={20} strokeWidth={1} />
            </Link>
            <Link href="/cart" className={`relative transition-colors ${hoverColor}`}>
              <ShoppingBag size={20} strokeWidth={1} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-kakatiya-gold text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-sans">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-stone-50 z-[60] transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full relative">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-stone-900 hover:rotate-90 transition-transform duration-500">
            <X size={32} strokeWidth={1} />
          </button>
          
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <h2 className="font-royal text-3xl text-stone-900 mb-8">KAKATIYAS</h2>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-4xl text-stone-800 hover:text-kakatiya-gold hover:italic transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px w-20 bg-stone-300 my-8"></div>
            <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="uppercase text-xs tracking-[0.2em] text-stone-500">
              Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
