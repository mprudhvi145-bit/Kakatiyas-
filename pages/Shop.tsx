import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_PRODUCTS, CURRENCY } from '../lib/constants';
import { Product, Category } from '../types';
import { SectionTitle } from '../components/ui/Shared';
import { Plus } from 'lucide-react';

interface ShopProps {
  addToCart: (p: Product) => void;
}

export default function Shop({ addToCart }: ShopProps) {
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');
  const query = new URLSearchParams(useLocation().search);
  const catParam = query.get('cat') as Category | null;

  React.useEffect(() => {
    if (catParam) setFilter(catParam);
  }, [catParam]);

  const filteredProducts = filter === 'ALL' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="pt-24 pb-20 container mx-auto px-6">
      <SectionTitle title="The Treasury" subtitle="Curated Excellence" />
      
      {/* Filter Tabs */}
      <div className="flex justify-center gap-8 mb-16 border-b border-stone-200 pb-4">
        {['ALL', 'FASHION', 'JEWELRY', 'HANDLOOM'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`uppercase text-xs tracking-widest pb-4 transition-all ${
              filter === cat 
                ? 'text-kakatiya-gold border-b-2 border-kakatiya-gold' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product.newArrival && (
                <span className="absolute top-4 left-4 bg-white/90 text-[10px] uppercase tracking-widest px-3 py-1 text-stone-900">
                  New Arrival
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/90 backdrop-blur-sm flex justify-between items-center">
                <span className="text-xs font-bold text-stone-800 uppercase">Quick Add</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  className="bg-stone-900 text-white p-2 hover:bg-kakatiya-gold transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest">{product.category}</p>
              <h3 className="font-royal text-lg text-stone-900 group-hover:text-kakatiya-gold transition-colors">{product.name}</h3>
              <p className="font-serif italic text-stone-600">{CURRENCY}{product.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
