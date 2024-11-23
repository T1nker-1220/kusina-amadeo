import Image from 'next/image';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

interface Addon {
  name: string;
  price: number;
}

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  category: string;
  productId: string;
  addons?: Addon[];
  image?: string;
}

const ProductCard = ({ name, description, price, category, productId, addons, image }: ProductCardProps) => {
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<Set<number>>(new Set());
  const [showAddons, setShowAddons] = useState(false);

  const toggleAddon = (index: number) => {
    const newSelectedAddons = new Set(selectedAddons);
    if (selectedAddons.has(index)) {
      newSelectedAddons.delete(index);
    } else {
      newSelectedAddons.add(index);
    }
    setSelectedAddons(newSelectedAddons);
  };

  const calculateTotalPrice = () => {
    let total = price;
    selectedAddons.forEach((index) => {
      if (addons && addons[index]) {
        total += addons[index].price;
      }
    });
    return total;
  };

  const handleAddToCart = () => {
    const selectedAddonsList = Array.from(selectedAddons)
      .map(index => addons?.[index])
      .filter((addon): addon is Addon => addon !== undefined);

    const cartItem = {
      id: `${productId}${selectedAddonsList.map(a => `-${a.name}`).join('')}`,
      name,
      price: calculateTotalPrice(),
      quantity: 1,
      image,
      addons: selectedAddonsList,
    };

    addItem(cartItem);
    setSelectedAddons(new Set()); // Reset selected addons
    setShowAddons(false); // Close addons menu
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-56 w-full group overflow-hidden bg-gray-100">
        <Image
          src={imageError ? '/images/products/placeholder-food.jpg' : (image || '/images/products/placeholder-food.jpg')}
          alt={name}
          fill
          className={`object-cover transition-all duration-500 ${
            isHovered ? 'scale-110 brightness-90' : 'scale-100'
          }`}
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
          <span className="font-semibold">₱{calculateTotalPrice()}</span>
        </div>
        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Add-ons Section */}
        {addons && addons.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowAddons(!showAddons)}
              className="w-full text-left mb-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>Customize Your Order</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${showAddons ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className={`space-y-2 transition-all duration-300 ${
              showAddons ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              {addons.map((addon, index) => (
                <label
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedAddons.has(index)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedAddons.has(index)}
                      onChange={() => toggleAddon(index)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">{addon.name}</span>
                  </div>
                  <span className="text-sm font-medium text-primary">+₱{addon.price}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className={`w-full bg-primary text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 
            transition-all duration-300 ${
              isHovered 
                ? 'bg-primary shadow-lg shadow-primary/30' 
                : 'hover:bg-primary/90'
            }`}
        >
          <ShoppingCartIcon className={`h-5 w-5 transition-transform duration-300 ${
            isHovered ? 'scale-110' : ''
          }`} />
          <span className="font-medium">
            Add to Cart • ₱{calculateTotalPrice()}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
