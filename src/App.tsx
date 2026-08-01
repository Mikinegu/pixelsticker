import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
          <Navbar onOpenCart={() => setIsCartOpen(true)} />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-100 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} STICKERS. All rights reserved.
              </p>
            </div>
          </footer>

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          />

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
