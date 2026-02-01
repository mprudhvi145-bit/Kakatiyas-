
import React from 'react';
import { db } from '../../../../../lib/db';
import { ProductForm } from '../../../../../components/admin/ProductForm';
import { requireAdmin } from '../../../../../lib/auth-guard';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: { productId: string } }) {
  await requireAdmin();
  const product = await db.product.findUnique({
    where: { id: params.productId },
    include: { images: true }
  });
  
  if (!product) notFound();

  const categories = await db.category.findMany();

  return (
    <div className="p-8 md:p-12">
      <h1 className="font-royal text-2xl text-stone-800 mb-8">Edit Product</h1>
      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
