import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockStickers, categories } from '../data/stickers';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const featuredProducts = mockStickers.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-50 py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 mb-6">
            Stick to your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
              personality.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mb-10">
            Premium, minimalist stickers for laptops, notebooks, and everywhere in between.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium text-white bg-black hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Shop Now
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-10">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.filter(c => c !== 'All').map((category) => (
            <Link
              key={category}
              to={`/shop?category=${category}`}
              className="group relative h-48 md:h-64 bg-gray-100 flex items-center justify-center overflow-hidden transition-all hover:shadow-md"
            >
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10"></div>
              <span className="relative z-20 text-lg font-semibold tracking-wider uppercase text-gray-900 bg-white/90 px-4 py-2 backdrop-blur-sm group-hover:scale-105 transition-transform">
                {category}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Stickers</h2>
            <Link to="/shop" className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors border-b border-gray-900 pb-0.5">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
