import { OrderStats } from "@/components/admin/OrderStats";
import { RecentOrders } from "@/components/admin/RecentOrders";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <OrderStats />
      <RecentOrders />
    </div>
  );
}
