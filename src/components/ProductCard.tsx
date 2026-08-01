import React from 'react';
import { Link } from 'react-router-dom';
import { Sticker } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Sticker;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 overflow-hidden transition-all hover:shadow-lg hover:border-gray-200">
      <Link to={`/product/${product.id}`} className="aspect-square overflow-hidden bg-gray-50 relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-white px-2 py-1 text-xs font-medium text-gray-600 tracking-wider">
          {product.category}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:underline underline-offset-4 mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-base font-medium text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            className="text-xs font-medium text-white bg-black px-3 py-2 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
