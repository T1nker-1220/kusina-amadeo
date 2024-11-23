'use client';

import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'cod'>('cod');

  useEffect(() => {
    const checkSession = async () => {
      if (!session?.user) {
        router.push('/login?redirect=/checkout');
        return;
      }
      if (state.items.length === 0) {
        router.push('/cart');
      }
    };
    
    checkSession();
  }, [session, state.items.length, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create the order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            addons: item.addons || []
          })),
          total: state.total,
          paymentMethod
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Clear the cart after successful order
      clearCart();
      
      // Redirect to the order confirmation page
      router.push(`/orders/${orderData._id}`);
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(error.message || 'Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session || state.items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    {item.addons && item.addons.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Add-ons: {item.addons.map(addon => addon.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(state.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'gcash' | 'cod')}
                  className="form-radio text-primary mr-3"
                />
                <div>
                  <div className="font-medium">Cash on Pickup</div>
                  <div className="text-sm text-gray-500">Pay when you pick up your order</div>
                </div>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="gcash"
                  checked={paymentMethod === 'gcash'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'gcash' | 'cod')}
                  className="form-radio text-primary mr-3"
                />
                <div>
                  <div className="font-medium">GCash</div>
                  <div className="text-sm text-gray-500">Pay via GCash</div>
                </div>
              </label>
              <div className="p-4 bg-gray-50 rounded-lg mt-4">
                <p className="text-sm text-gray-600">
                  {paymentMethod === 'gcash' 
                    ? 'You will be shown the GCash payment details after placing your order.'
                    : 'Please prepare the exact amount when picking up your order.'}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
