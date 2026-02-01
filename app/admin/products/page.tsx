
import React from 'react';
import Link from 'next/link';
import { db } from '../../../lib/db';
import { Button } from '../../../components/ui/Shared';
import { CURRENCY } from '../../../lib/constants';
import { requireAdmin } from '../../../lib/auth-guard';

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 md:p-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-royal text-3xl text-stone-800">Products</h1>
        <Link href="/admin/products/new">
          <Button className="py-2 px-4 text-[10px]">Add Product</Button>
        </Link>
      </div>

      <div className="bg-white shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-medium text-stone-900">{p.name}</td>
                <td className="px-6 py-4 text-stone-500">{p.slug}</td>
                <td className="px-6 py-4 text-stone-600">{p.category?.name || '-'}</td>
                <td className="px-6 py-4 font-serif">{CURRENCY}{p.price}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-kakatiya-gold hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                  No products found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
