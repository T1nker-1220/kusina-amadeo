'use client';

import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { state, updateQuantity, removeItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    if (!session) {
      router.push('/login?redirect=/cart');
      return;
    }
    router.push('/checkout');
  };

  // Calculate total
  const total = state.total;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {state.items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="mb-6">
            <Image
              src="/empty-cart.png"
              alt="Empty Cart"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          <p className="text-gray-600 mb-6">Your cart is empty</p>
          <button
            onClick={() => router.push('/menu')}
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
              >
                {item.image && (
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      {item.addons && item.addons.length > 0 && (
                        <p className="text-sm text-gray-500">
                          Add-ons: {item.addons.map(addon => addon.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <button
                onClick={() => router.push('/menu')}
                className="w-full mt-3 text-gray-600 hover:text-gray-800"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
