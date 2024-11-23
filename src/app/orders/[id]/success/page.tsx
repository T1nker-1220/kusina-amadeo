'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    // After 5 seconds, redirect to order details page
    const timer = setTimeout(() => {
      router.push(`/orders/${params.id}`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, params.id]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        <p className="text-sm text-gray-500">
          You will be redirected to your order details page in a few seconds...
        </p>
        <button
          onClick={() => router.push(`/orders/${params.id}`)}
          className="mt-6 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
        >
          View Order Details
        </button>
      </div>
    </div>
  );
}
