'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function OrderFailedPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    // After 5 seconds, redirect to checkout page
    const timer = setTimeout(() => {
      router.push('/checkout');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          We're sorry, but your payment could not be processed. Please try again.
        </p>
        <p className="text-sm text-gray-500">
          You will be redirected to the checkout page in a few seconds...
        </p>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/contact')}
            className="w-full border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
