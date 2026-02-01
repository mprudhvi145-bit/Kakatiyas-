
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Shared';
import { ProductType } from '../../types/index';

interface ProductFormProps {
  initialData?: any;
  categories: { id: string; name: string }[];
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    type: initialData?.type || ProductType.FASHION,
    categoryId: initialData?.categoryId || (categories[0]?.id || ''),
    images: initialData?.images?.map((img: any) => img.url).join(',') || '', // Simple comma separated for now
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      // Convert comma-separated string back to array for API
      images: formData.images.split(',').map((s: string) => s.trim()).filter(Boolean) 
    };

    try {
      const url = initialData 
        ? `/api/admin/products/${initialData.id}` 
        : '/api/admin/products';
      
      const method = initialData ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save product');

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 border border-stone-200">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase font-bold text-stone-500 mb-2">Product Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-stone-200 p-3 text-sm focus:border-kakatiya-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase font-bold text-stone-500 mb-2">Slug (URL)</label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full border border-stone-200 p-3 text-sm focus:border-kakatiya-gold outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase font-bold text-stone-500 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full border border-stone-200 p-3 text-sm focus:border-kakatiya-gold outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase font-bold text-stone-500 mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border border-stone-200 p-3 text-sm focus:border-kakatiya-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase font-bold text-stone-500 mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full border border-stone-200 p-3 text-sm focus:border-kakatiya-gold outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase font-bold text-stone-500 mb-2">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-stone-200 p-3 text-sm focus:border-kakatiya-gold outline-none bg-white"
          >
            {Object.values(ProductType).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase font-bold text-stone-500 mb-2">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full border border-stone-200 p-3 text-sm focus:border-kakatiya-gold outline-none bg-white"
          >
             <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase font-bold text-stone-500 mb-2">Image URLs (Comma separated)</label>
        <input
          name="images"
          value={formData.images}
          onChange={handleChange}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          className="w-full border border-stone-200 p-3 text-sm focus:border-kakatiya-gold outline-none"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Product'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
