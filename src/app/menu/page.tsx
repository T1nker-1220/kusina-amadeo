'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

const CATEGORIES = ['All', 'Budget Meals', 'Silog Meals', 'Ala Carte', 'Beverages'];

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      let url = '/api/products';
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setLoading(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Menu</h1>
      
      {/* Category Filter */}
      <div className="flex overflow-x-auto space-x-4 mb-8 pb-4">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap
              ${selectedCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-primary/10'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search menu items..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          products.map((product: any) => (
            <ProductCard
              key={product.productId}
              name={product.name}
              description={product.description}
              price={product.price}
              category={product.category}
              productId={product.productId}
              addons={product.addons}
              image={product.image}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
