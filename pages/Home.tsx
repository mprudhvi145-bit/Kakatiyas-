import React from 'react';
import { FadeIn, Button, SectionTitle } from '../components/ui/Shared';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2574&auto=format&fit=crop")' }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
          <FadeIn>
            <p className="uppercase tracking-[0.3em] text-sm md:text-base mb-6 text-kakatiya-gold">Est. 2024 • Warangal Heritage</p>
            <h1 className="font-royal text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight">
              The Kakatiya <br/> Revival
            </h1>
            <Button variant="primary" className="bg-white text-stone-900 hover:bg-kakatiya-gold hover:text-white">
              Explore Collection
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 px-6 md:px-12 bg-kakatiya-base">
        <div className="container mx-auto max-w-4xl text-center">
          <SectionTitle title="A Legacy Reborn" subtitle="The Golden Era" />
          <p className="font-serif text-lg md:text-xl text-stone-600 leading-loose">
            Rooted in the architectural grandeur of the Kakatiya dynasty, our collections are a tribute to an era of unparalleled craftsmanship. 
            From the intricate weaves of Warangal to the temple jewelry of the Deccan, we bring you heirlooms designed to last forever.
          </p>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
          {[
            { title: 'Handloom', img: 'https://images.unsplash.com/photo-1609803606626-476483984534?auto=format&fit=crop&q=80&w=800', link: '/shop?cat=HANDLOOM' },
            { title: 'Jewelry', img: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=800', link: '/shop?cat=JEWELRY' },
            { title: 'Fashion', img: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=800', link: '/shop?cat=FASHION' }
          ].map((cat, idx) => (
            <div key={idx} className="relative group overflow-hidden h-[400px] md:h-full cursor-pointer">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.img})` }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <h3 className="font-royal text-3xl text-white mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.title}</h3>
                <span className="text-white uppercase text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-b border-white pb-1">Discover</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
