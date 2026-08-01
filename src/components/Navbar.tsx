import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold tracking-tighter text-gray-900">
              STICKERS.
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Shop</Link>
            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
