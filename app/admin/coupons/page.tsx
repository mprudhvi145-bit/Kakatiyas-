
import React from 'react';
import { db } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth-guard';
import { Button } from '../../../components/ui/Shared';
import { revalidatePath } from 'next/cache';

export default async function AdminCouponsPage() {
  await requireAdmin();
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } });

  async function createCoupon(formData: FormData) {
    "use server";
    const code = formData.get('code') as string;
    const discount = formData.get('discount') as string;
    const expiresAt = formData.get('expiresAt') as string;

    if (!code || !discount) return;

    await db.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount: Number(discount),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });
    revalidatePath('/admin/coupons');
  }

  return (
    <div className="p-8 md:p-12">
      <h1 className="font-royal text-3xl text-stone-800 mb-8">Coupons</h1>

      <div className="bg-white p-6 shadow-sm border border-stone-200 mb-12 max-w-xl">
        <h3 className="font-bold text-sm uppercase mb-4">Create New Coupon</h3>
        <form action={createCoupon} className="space-y-4">
          <div>
            <input name="code" placeholder="Code (e.g. SUMMER20)" className="w-full border p-2 text-sm" required />
          </div>
          <div className="flex gap-4">
            <input name="discount" type="number" placeholder="Discount %" className="w-1/2 border p-2 text-sm" required min="1" max="100" />
            <input name="expiresAt" type="date" className="w-1/2 border p-2 text-sm" />
          </div>
          <Button type="submit" className="py-2 px-4 text-[10px] w-full">Create Coupon</Button>
        </form>
      </div>

      <div className="bg-white shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Expires</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 font-bold">{c.code}</td>
                <td className="px-6 py-4">{c.discount}%</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${c.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-stone-500">
                  {c.expiresAt ? c.expiresAt.toLocaleDateString() : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
