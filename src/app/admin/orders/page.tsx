'use client';

import OrderList from "@/components/admin/OrderList";

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>
      <OrderList />
    </div>
  );
}
