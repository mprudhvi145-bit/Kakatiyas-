
import React from 'react';
import { db } from '../../../../lib/db';
import { requireAuth } from '../../../../lib/auth-guard';
import { SectionTitle } from '../../../../components/ui/Shared';
import { CURRENCY } from '../../../../lib/constants';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';

interface OrderDetailPageProps {
  params: { orderId: string };
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  return {
    title: `Order #${params.orderId.slice(-6)} Details`,
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await requireAuth();

  const order = await db.order.findUnique({
    where: { id: params.orderId },
    include: {
      items: {
        include: {
          product: {
            include: { images: true }
          }
        }
      }
    }
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-6 max-w-3xl">
      <SectionTitle title={`Order #${order.id.slice(-6)}`} subtitle={new Date(order.createdAt).toLocaleDateString()} />
      
      <div className="bg-stone-50 p-8 border border-stone-200 mb-8">
         <div className="flex justify-between items-center mb-4">
           <span className="uppercase text-xs tracking-widest text-stone-500">Status</span>
           <span className="font-bold">{order.status}</span>
         </div>
         <div className="flex justify-between items-center">
           <span className="uppercase text-xs tracking-widest text-stone-500">Total Amount</span>
           <span className="font-royal text-2xl">{CURRENCY}{order.total.toLocaleString()}</span>
         </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-royal text-xl border-b border-stone-200 pb-4">Items</h3>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-16 h-20 bg-stone-200 relative">
                {item.product?.images?.[0] && (
                  <Image 
                    src={item.product.images[0].url} 
                    alt={item.product.name} 
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>
              <div>
                <p className="font-bold text-stone-900">{item.product?.name || 'Unknown Product'}</p>
                <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <div className="font-serif">
              {CURRENCY}{(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
