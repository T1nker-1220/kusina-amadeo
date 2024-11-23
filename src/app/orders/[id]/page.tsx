'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { GCashPayment } from '@/components/GCashPayment';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
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
  orderStatus: string;
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
  paymentMethod: 'gcash' | 'cod';
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
  processing: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch order');
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError('Failed to load order details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [session, params.id, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>{error || 'Order not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>
        
        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-medium">{order._id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Status</p>
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Status</p>
              <span className={`px-3 py-1 rounded-full text-sm ${paymentStatusColors[order.paymentStatus]}`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <p className="font-medium">
            {order.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Pickup'}
          </p>
          
          {order.paymentMethod === 'gcash' && order.paymentStatus === 'processing' && (
            <div className="mt-4">
              <GCashPayment
                accountNumber="09605088715"
                accountName="John Nathaniel Marquez"
                amount={order.total.toFixed(2)}
                reference={`ORDER-${order._id}`}
              />
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  {item.addons && item.addons.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Add-ons: {item.addons.join(', ')}
                    </p>
                  )}
                </div>
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
