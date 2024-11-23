'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface OrderItem {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
  addons?: {
    name: string;
    price: number;
  }[];
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  orderStatus: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'gcash' | 'cash';
  deliveryAddress: string;
  notes?: string;
  createdAt: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setOrders(data);
      } catch (error) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

  if (!session?.user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start shopping to create your first order
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Order #{order._id.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${statusColors[order.orderStatus]}`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${paymentStatusColors[order.paymentStatus]}`}
                    >
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <li key={index} className="py-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                              {item.addons && item.addons.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-xs text-gray-600">Add-ons:</p>
                                  <ul className="text-xs text-gray-500">
                                    {item.addons.map((addon, i) => (
                                      <li key={i}>
                                        {addon.name} (+₱{addon.price})
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              ₱{item.price}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <p className="font-medium text-gray-900">Total</p>
                    <p className="font-medium text-gray-900">₱{order.total}</p>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Delivery Address: {order.deliveryAddress}</p>
                    <p>Payment Method: {order.paymentMethod.toUpperCase()}</p>
                    {order.notes && <p>Notes: {order.notes}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
