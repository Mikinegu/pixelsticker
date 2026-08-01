import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold tracking-tight">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="mb-4 text-center">Your cart is feeling a little empty.</p>
              <button
                onClick={onClose}
                className="text-sm font-medium text-black border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.map((item) => (
                <li key={item.product.id} className="flex gap-4">
                  <div className="h-24 w-24 flex-shrink-0 bg-gray-50 border border-gray-100">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h3 className="line-clamp-2 pr-4">{item.product.name}</h3>
                        <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{item.product.category}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-gray-700 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50/50">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-6">
              <p>Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-xs text-gray-500 mb-4">Shipping and taxes calculated at checkout.</p>
            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full bg-black px-6 py-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};
