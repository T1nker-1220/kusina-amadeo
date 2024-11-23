'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  addons?: Array<{
    name: string;
    price: number;
  }>;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
  paymentMethod: 'gcash' | 'cod';
  deliveryInfo?: {
    address: string;
    contact: string;
    instructions?: string;
  };
  createdAt: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
} as const;

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
} as const;

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to load orders');
      }
      const data = await response.json();
      setOrders(data);
      setError('');
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchOrders();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status, session, fetchOrders]);

  if (status === 'loading' || isLoading) {
    return <LoadingState />;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">
          Please{' '}
          <Link href="/signin" className="text-blue-600 hover:underline">
            sign in
          </Link>{' '}
          to view your orders.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">
          You haven't placed any orders yet.{' '}
          <Link href="/menu" className="text-blue-600 hover:underline">
            Browse our menu
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID: {order._id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on:{' '}
                    {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.orderStatus]
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      paymentStatusColors[order.paymentStatus]
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {item.quantity}x {item.name}
                        </p>
                        {item.addons && item.addons.length > 0 && (
                          <p className="text-sm text-gray-500">
                            Add-ons:{' '}
                            {item.addons
                              .map((addon) => addon.name)
                              .join(', ')}
                          </p>
                        )}
                      </div>
                      <p className="text-gray-900">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between">
                  <p className="font-medium">Total</p>
                  <p className="font-semibold">₱{order.total.toFixed(2)}</p>
                </div>
                {order.deliveryInfo && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Delivery Address: {order.deliveryInfo.address}</p>
                    <p>Contact: {order.deliveryInfo.contact}</p>
                    {order.deliveryInfo.instructions && (
                      <p>Instructions: {order.deliveryInfo.instructions}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        {[1, 2].map((n) => (
          <div key={n} className="bg-white shadow rounded-lg p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
