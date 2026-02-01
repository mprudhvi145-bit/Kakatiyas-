
import React from 'react';
import { db } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth-guard';
import { CURRENCY } from '../../../lib/constants';

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await db.order.findMany({
    include: {
      user: true,
      items: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 md:p-12">
      <h1 className="font-royal text-3xl text-stone-800 mb-8">Orders</h1>

      <div className="bg-white shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Items</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{order.id.slice(-6)}</td>
                <td className="px-6 py-4">
                  <div className="text-stone-900 font-medium">{order.user.name}</div>
                  <div className="text-xs text-stone-500">{order.user.email}</div>
                </td>
                <td className="px-6 py-4 text-stone-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                     order.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-serif">{CURRENCY}{order.total.toLocaleString()}</td>
                <td className="px-6 py-4">{order.items.length}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
