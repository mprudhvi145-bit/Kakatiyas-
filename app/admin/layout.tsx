
import React from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { requireAdmin } from '../../lib/auth-guard';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect this route tree
  await requireAdmin();

  return (
    <div className="min-h-screen bg-stone-100 flex">
      <AdminNav />
      <div className="md:ml-64 flex-1">
        {children}
      </div>
    </div>
  );
}
