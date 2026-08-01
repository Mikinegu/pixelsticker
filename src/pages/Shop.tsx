import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { mockStickers, categories } from '../data/stickers';
import { ProductCard } from '../components/ProductCard';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Update URL when category changes, or init if loaded from URL
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const handleCategoryChange = (category: string) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...mockStickers];

    // Filter by Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-8 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Shop All Stickers</h1>
          <p className="text-gray-500 text-sm">Find the perfect sticker to express yourself.</p>
        </div>

        {/* Controls */}
        <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Filters */}
        <div className={`md:w-48 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Category</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => handleCategoryChange(category)}
                    className={`text-sm transition-colors ${
                      selectedCategory === category
                        ? 'font-medium text-black'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Sort By</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setSortBy('featured')}
                  className={`text-sm transition-colors ${
                    sortBy === 'featured' ? 'font-medium text-black' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Featured
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSortBy('price-asc')}
                  className={`text-sm transition-colors ${
                    sortBy === 'price-asc' ? 'font-medium text-black' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Price: Low to High
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSortBy('price-desc')}
                  className={`text-sm transition-colors ${
                    sortBy === 'price-desc' ? 'font-medium text-black' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Price: High to Low
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50">
              <p className="text-gray-500">No products found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  handleCategoryChange('All');
                }}
                className="mt-4 text-sm font-medium text-black border-b border-black pb-1"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
