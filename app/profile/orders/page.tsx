
import React from 'react';
import Link from 'next/link';
import { db } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth-guard';
import { SectionTitle, Button } from '../../../components/ui/Shared';
import { CURRENCY } from '../../../lib/constants';
import { OrderStatus } from '../../../types/index';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order History | KAKATIYAS',
  description: 'View your past orders.',
};

export default async function OrdersPage() {
  const session = await requireAuth();

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 max-w-4xl">
      <SectionTitle title="Order History" />
      
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="font-serif text-stone-600 mb-8">You haven't placed any orders yet.</p>
          <Link href="/shop">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-stone-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest text-stone-500">Order #{order.id.slice(-6)}</p>
                <p className="font-serif text-lg">{new Date(order.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2 items-center">
                   <span className={`text-xs font-bold px-2 py-1 rounded-sm ${
                     order.status === OrderStatus.PAID ? 'bg-green-100 text-green-800' : 
                     order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                     'bg-stone-100 text-stone-800'
                   }`}>
                     {order.status}
                   </span>
                   <span className="text-sm text-stone-600">{order.items.length} Items</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-royal text-xl mb-2">{CURRENCY}{order.total.toLocaleString()}</p>
                <Link href={`/profile/orders/${order.id}`}>
                  <span className="text-xs uppercase font-bold text-kakatiya-gold border-b border-kakatiya-gold hover:text-stone-900 hover:border-stone-900 transition-colors cursor-pointer">
                    View Details
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
