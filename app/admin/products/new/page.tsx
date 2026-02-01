
import React from 'react';
import { db } from '../../../../lib/db';
import { ProductForm } from '../../../../components/admin/ProductForm';
import { requireAdmin } from '../../../../lib/auth-guard';

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await db.category.findMany();

  return (
    <div className="p-8 md:p-12">
      <h1 className="font-royal text-2xl text-stone-800 mb-8">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
