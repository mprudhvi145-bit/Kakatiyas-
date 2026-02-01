
"use client";

import React, { useState } from 'react';
import { MOCK_PRODUCTS, CURRENCY } from '../../lib/constants';
import { Button } from '../../components/ui/Shared';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'ORDERS' | 'ANALYTICS'>('ANALYTICS');
  
  const mockAnalytics = [
    { name: 'Jan', sales: 400000 },
    { name: 'Feb', sales: 300000 },
    { name: 'Mar', sales: 600000 },
    { name: 'Apr', sales: 800000 },
    { name: 'May', sales: 500000 },
    { name: 'Jun', sales: 900000 },
  ];

  return (
    <div className="p-8 md:p-12 overflow-y-auto">
      <header className="flex justify-between items-center mb-12">
        <h1 className="font-royal text-3xl text-stone-800 capitalize">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase font-bold text-stone-500">Admin User</span>
          <div className="w-10 h-10 rounded-full bg-stone-300"></div>
        </div>
      </header>

      {/* Tabs for quick switching within the Dashboard Overview */}
      <div className="flex gap-4 mb-8 border-b border-stone-200">
        {['ANALYTICS', 'PRODUCTS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-2 text-xs uppercase tracking-widest ${
              activeTab === tab ? 'border-b-2 border-kakatiya-gold text-kakatiya-gold' : 'text-stone-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'ANALYTICS' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Revenue', val: '₹42.5L', change: '+12%' },
              { label: 'Active Orders', val: '24', change: '-2%' },
              { label: 'Artisan Payouts', val: '₹12.8L', change: '+5%' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 shadow-sm border border-stone-200">
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">{stat.label}</p>
                <div className="flex justify-between items-end">
                  <h3 className="font-serif text-3xl text-stone-900">{stat.val}</h3>
                  <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-8 shadow-sm border border-stone-200 h-[400px]">
            <h3 className="font-royal text-lg mb-6">Sales Performance</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#fff', border: '1px solid #e7e5e4'}} />
                <Bar dataKey="sales" fill="#C5A059" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'PRODUCTS' && (
        <div className="bg-white shadow-sm border border-stone-200">
          <div className="p-6 border-b border-stone-200 flex justify-between items-center">
            <h3 className="font-serif italic text-lg text-stone-600">Inventory Management</h3>
            <Button className="py-2 px-4 text-[10px]">Add New Product</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {MOCK_PRODUCTS.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img src={p.images[0]} alt="" className="w-10 h-10 object-cover" />
                      <span className="font-medium text-stone-900">{p.name}</span>
                    </td>
                    <td className="px-6 py-4 text-stone-600">{p.category}</td>
                    <td className="px-6 py-4 font-serif">{CURRENCY}{p.price}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        In Stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-kakatiya-gold hover:underline cursor-pointer">Edit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
