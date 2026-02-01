
import React from 'react';
import { db } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth-guard';
import { Button } from '../../../components/ui/Shared';
import { revalidatePath } from 'next/cache';
import { CURRENCY } from '../../../lib/constants';
import crypto from 'crypto';

export default async function AdminGiftCardsPage() {
  await requireAdmin();
  const cards = await db.giftCard.findMany({ orderBy: { createdAt: 'desc' } });

  async function createGiftCard(formData: FormData) {
    "use server";
    const balance = formData.get('balance') as string;
    if (!balance) return;

    // We can't use crypto directly in server actions in some environments if not imported, 
    // but this file is server-side.
    // However, for simplicity using Prisma create directly with imported crypto logic here is weird.
    // Let's call the API or implement logic. Implementation here is cleaner for Server Actions.
    
    // Note: Node's crypto is available in Server Components/Actions.
    const { randomBytes } = await import('crypto');
    const code = 'GC-' + randomBytes(4).toString('hex').toUpperCase();

    await db.giftCard.create({
      data: {
        code,
        balance: Number(balance),
      }
    });
    revalidatePath('/admin/giftcards');
  }

  return (
    <div className="p-8 md:p-12">
      <h1 className="font-royal text-3xl text-stone-800 mb-8">Gift Cards</h1>

      <div className="bg-white p-6 shadow-sm border border-stone-200 mb-12 max-w-xl">
        <h3 className="font-bold text-sm uppercase mb-4">Issue New Gift Card</h3>
        <form action={createGiftCard} className="space-y-4">
          <div>
            <input name="balance" type="number" placeholder="Balance Amount" className="w-full border p-2 text-sm" required min="1" />
          </div>
          <Button type="submit" className="py-2 px-4 text-[10px] w-full">Generate Card</Button>
        </form>
      </div>

      <div className="bg-white shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Issued</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {cards.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 font-mono font-bold text-stone-900">{c.code}</td>
                <td className="px-6 py-4 font-serif">{CURRENCY}{c.balance}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${c.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {c.active ? 'Active' : 'Redeemed'}
                  </span>
                </td>
                <td className="px-6 py-4 text-stone-500">
                  {c.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
