import { getOrderById } from "@/lib/db/orders";
import { formatDate } from "@/lib/utils";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrderById(params.id);

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
        <span className={`px-3 py-1 rounded-full text-sm ${
          {
            pending: "bg-yellow-100 text-yellow-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
          }[order.status]
        }`}>
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
            <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
            <p><span className="font-medium">Total Amount:</span> ₱{order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {order.customer.name}</p>
            <p><span className="font-medium">Email:</span> {order.customer.email}</p>
            <p><span className="font-medium">Phone:</span> {order.customer.phone}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item: any) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₱{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₱{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-6 py-4 text-right font-medium">Total</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">₱{order.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {order.paymentMethod === "gcash" && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Payment Status:</span> {order.paymentStatus || "Pending"}</p>
            {order.paymentScreenshot && (
              <div>
                <p className="font-medium mb-2">Payment Screenshot:</p>
                <img 
                  src={order.paymentScreenshot} 
                  alt="Payment Screenshot" 
                  className="max-w-md rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
