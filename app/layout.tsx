
import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { CartProvider } from '../components/providers/CartProvider';
import { AuthProvider } from '../components/providers/AuthProvider';
import { Playfair_Display, Cinzel, Lato } from 'next/font/google';
import './globals.css';

// Optimize Fonts
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-royal',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://kakatiyas.com'),
  title: {
    default: 'KAKATIYAS | Heritage Luxury',
    template: '%s | KAKATIYAS'
  },
  description: 'Indian heritage luxury, handcrafted by master artisans. Fashion, Jewelry, and Handloom from the Kakatiya era.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kakatiyas.com',
    siteName: 'KAKATIYAS',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KAKATIYAS Heritage Luxury',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@kakatiyas',
    creator: '@kakatiyas',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cinzel.variable} ${lato.variable}`}>
      <body className="bg-kakatiya-base text-stone-900 font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </CartProvider>
        </AuthProvider>
        {/* Analytics Placeholder */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
