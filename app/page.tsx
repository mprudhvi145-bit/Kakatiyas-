
import React from 'react';
import { FadeIn, Button, SectionTitle } from '../components/ui/Shared';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'KAKATIYAS — Timeless Indian Luxury',
  description: 'Discover heritage fashion, temple jewelry, and royal handloom crafted by master artisans of India.',
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-stone-900">
          {/* Background Image - CSS preferred for full coverage/zoom effects but Next/Image could be used with fill */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-70 animate-slow-zoom"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1605218427368-35b0d996615b?q=80&w=2574&auto=format&fit=crop")' }}
          ></div>
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
          <FadeIn>
            <p className="uppercase tracking-[0.3em] text-xs md:text-sm mb-8 text-white/80 font-medium">The Art of Indian Heritage</p>
            <h1 className="font-royal text-5xl md:text-7xl lg:text-9xl mb-10 leading-none tracking-tight">
              Kakatiyas
            </h1>
            <p className="font-serif text-lg md:text-2xl text-stone-200 mb-12 max-w-xl mx-auto italic">
              "Weaving the past into the present with threads of gold and stories of old."
            </p>
            <Link href="/shop">
              <Button variant="white">Explore the Collection</Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Brand Narrative */}
      <section className="py-32 px-6 bg-kakatiya-base">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[600px] overflow-hidden w-full">
             <Image 
               src="https://images.unsplash.com/photo-1579270509630-f9479e0f6d53?q=80&w=2000&auto=format&fit=crop" 
               alt="Artisan Weaving" 
               fill
               className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
               sizes="(max-width: 768px) 100vw, 50vw"
             />
          </div>
          <div className="md:pl-12">
            <span className="text-kakatiya-gold uppercase tracking-[0.2em] text-xs font-bold mb-6 block">Our Heritage</span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-8 leading-tight">
              Crafted by the <br/> Masters of Warangal.
            </h2>
            <p className="font-sans text-stone-600 leading-loose text-lg mb-8">
              Every piece in our collection is a testament to the endurance of the Kakatiya legacy. 
              We work directly with third-generation weavers and smiths who still practice the techniques carved into the Ramappa Temple walls centuries ago.
            </p>
            <p className="font-serif italic text-stone-500 text-xl mb-10">
              Handloom • Handcrafted • Heirloom
            </p>
            <Link href="/about">
              <span className="uppercase text-xs tracking-widest border-b border-stone-900 pb-1 hover:text-kakatiya-gold hover:border-kakatiya-gold transition-colors">Read Our Story</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Grid - Mosaic Layout */}
      <section className="py-24 px-4 bg-stone-100">
        <div className="container mx-auto">
          <SectionTitle title="The Collections" subtitle="Curated For You" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[800px]">
            {/* Main Feature */}
            <Link href="/shop?cat=HANDLOOM" className="md:col-span-2 md:row-span-2 relative group overflow-hidden cursor-pointer">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1609803606626-476483984534?auto=format&fit=crop&q=80&w=1200")' }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="uppercase tracking-[0.2em] text-xs mb-2">Signature</p>
                <h3 className="font-royal text-4xl">Royal Handloom</h3>
              </div>
            </Link>

            {/* Secondary 1 */}
            <Link href="/shop?cat=JEWELRY" className="relative group overflow-hidden cursor-pointer">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800")' }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="font-royal text-2xl">Temple Jewelry</h3>
              </div>
            </Link>

            {/* Secondary 2 */}
            <Link href="/shop?cat=FASHION" className="relative group overflow-hidden cursor-pointer">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=800")' }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="font-royal text-2xl">Modern Fashion</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Artisan Highlight */}
      <section className="py-32 bg-stone-900 text-stone-200">
        <div className="container mx-auto px-6 text-center">
          <p className="text-kakatiya-gold uppercase tracking-[0.3em] text-xs mb-6">Meet the Hands</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-10 leading-tight">
            "We do not just weave cloth.<br/> We weave our history."
          </h2>
          <p className="font-sans text-stone-400 text-lg mb-12 italic max-w-2xl mx-auto">
            — Master Weaver Rao, Warangal
          </p>
          <Link href="/artisans">
            <Button variant="outline" className="text-white border-stone-700 hover:border-white hover:bg-white hover:text-stone-900">
              Discover Our Artisans
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
