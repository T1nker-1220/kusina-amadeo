"use client";

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, PRICE_RANGE, PRODUCT_STATUS } from '@/lib/constants';

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availability, setAvailability] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, availability]);

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
      if (minPrice) {
        params.append('minPrice', minPrice);
      }
      if (maxPrice) {
        params.append('maxPrice', maxPrice);
      }
      if (availability !== 'all') {
        params.append('availability', availability);
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

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (type === 'min') setMinPrice(value);
      else setMaxPrice(value);
      setLoading(true);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setAvailability('all');
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

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search menu items..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {/* Clear Filters Button */}
          {(selectedCategory !== 'All' || searchQuery || minPrice || maxPrice || availability !== 'all') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            {/* Price Range */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (₱)
                </label>
                <input
                  type="text"
                  value={minPrice}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  placeholder={PRICE_RANGE.MIN.toString()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (₱)
                </label>
                <input
                  type="text"
                  value={maxPrice}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  placeholder={PRICE_RANGE.MAX.toString()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Items</option>
                <option value={PRODUCT_STATUS.AVAILABLE}>Available Only</option>
                <option value={PRODUCT_STATUS.UNAVAILABLE}>Unavailable Only</option>
              </select>
            </div>
          </div>
        )}
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
