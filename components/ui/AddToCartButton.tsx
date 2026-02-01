
"use client";

import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../providers/CartProvider';
import { Button } from './Shared';
import { Check } from 'lucide-react';

interface AddToCartButtonProps {
  product: Omit<Product, 'images'> & { images: { url: string }[] };
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
      <Button 
        onClick={handleAdd} 
        disabled={product.stock <= 0 || added}
        className="w-full md:w-auto transition-all duration-300"
      >
        {product.stock <= 0 ? 'Out of Stock' : added ? (
          <span className="flex items-center gap-2 justify-center"><Check size={16} /> Added</span>
        ) : 'Add to Cart'}
      </Button>
    </div>
  );
};
