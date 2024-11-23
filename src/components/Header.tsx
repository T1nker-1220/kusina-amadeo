'use client';

import Link from 'next/link';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const { data: session } = useSession();
  const { state } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-display font-bold text-primary">
              Kusina De Amadeo
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link href="/menu" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Menu
            </Link>
            <Link href="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.items.length}
                </span>
              )}
            </Link>
            
            <div className="relative">
              {session ? (
                <div>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-900"
                  >
                    <UserIcon className="h-6 w-6" />
                    <span className="text-sm font-medium">{session.user?.name}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Orders
                      </Link>
                      {session.user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
