import { getOrderById } from "@/lib/db/orders";
import { formatDate } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  addons?: string[];
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
  paymentMethod: 'gcash' | 'cod';
  createdAt: string;
  customer?: {
    name: string;
    email: string;
  };
}

interface OrderStatus {
  pending: string;
  completed: string;
  cancelled: string;
  [key: string]: string;
}

const statusColors: OrderStatus = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrderById(params.id) as Order | null;

  if (!order) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Order Not Found</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status] || statusColors.pending}`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Order ID:</span> {order._id}</p>
            <p><span className="font-medium">Date:</span> {formatDate(order.createdAt)}</p>
            <p><span className="font-medium">Payment Method:</span> {order.paymentMethod.toUpperCase()}</p>
            <p><span className="font-medium">Total Amount:</span> {new Intl.NumberFormat('en-PH', {
              style: 'currency',
              currency: 'PHP'
            }).format(order.total)}</p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="space-y-2">
            {order.customer ? (
              <>
                <p><span className="font-medium">Name:</span> {order.customer.name}</p>
                <p><span className="font-medium">Email:</span> {order.customer.email}</p>
              </>
            ) : (
              <p>No customer information available</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item: OrderItem, index: number) => (
            <div key={index} className="flex justify-between items-start py-2 border-b last:border-0">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                {item.addons && item.addons.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Add-ons: {item.addons.join(', ')}
                  </p>
                )}
              </div>
              <p className="font-medium">
                {new Intl.NumberFormat('en-PH', {
                  style: 'currency',
                  currency: 'PHP'
                }).format(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
