import { OrderList } from "@/components/admin/OrderList";

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Order Management</h1>
      <OrderList />
    </div>
  );
}
