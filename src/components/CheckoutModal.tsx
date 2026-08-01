import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  if (!isOpen) return null;

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-white p-8 max-w-sm w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order Confirmed</h3>
          <p className="text-sm text-gray-500 mb-6">
            Thank you for your purchase! Your stickers will be on their way soon.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              onClose();
            }}
            className="w-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Checkout</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Shipping Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs text-gray-700 mb-1">First Name</label>
                    <input required type="text" id="firstName" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs text-gray-700 mb-1">Last Name</label>
                    <input required type="text" id="lastName" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className="block text-xs text-gray-700 mb-1">Address</label>
                  <input required type="text" id="address" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-xs text-gray-700 mb-1">City</label>
                    <input required type="text" id="city" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-xs text-gray-700 mb-1">ZIP / Postal</label>
                    <input required type="text" id="zip" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Mock Payment Details</h3>
              <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-3 border border-gray-100">
                Note: This is a placeholder for your custom payment verification. Enter any details.
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="card" className="block text-xs text-gray-700 mb-1">Card Number</label>
                  <input required type="text" id="card" placeholder="0000 0000 0000 0000" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="exp" className="block text-xs text-gray-700 mb-1">Expiry Date</label>
                    <input required type="text" id="exp" placeholder="MM/YY" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-xs text-gray-700 mb-1">CVC</label>
                    <input required type="text" id="cvc" placeholder="123" className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between font-medium text-lg mb-6">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white px-6 py-4 text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {isProcessing ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
