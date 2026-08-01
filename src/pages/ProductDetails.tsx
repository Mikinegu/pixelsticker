import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Plus, Minus } from 'lucide-react';
import { mockStickers } from '../data/stickers';
import { useCart } from '../context/CartContext';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = mockStickers.find((p) => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="text-gray-600 hover:text-black border-b border-black">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Reset quantity after adding
    setQuantity(1);
  };

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/shop" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Image */}
        <div className="aspect-square bg-gray-50 border border-gray-100 p-8 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="object-cover w-full h-full max-w-md shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
            <Link
              to={`/shop?category=${product.category}`}
              className="text-xs font-semibold tracking-widest text-gray-400 uppercase hover:text-black transition-colors"
            >
              {product.category}
            </Link>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">{product.name}</h1>
          <div className="text-2xl font-medium text-gray-900 mb-6">${product.price.toFixed(2)}</div>

          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-8">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= averageRating ? 'fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          <p className="text-gray-600 mb-10 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mb-10 border-t border-b border-gray-100 py-6">
            <span className="text-sm font-medium text-gray-900">Quantity</span>
            <div className="flex items-center border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-6 py-2 text-gray-900 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white px-8 py-4 text-base font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            Add to Cart - ${(product.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-24 border-t border-gray-100 pt-16">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review this sticker!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-gray-900">{review.author}</span>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
