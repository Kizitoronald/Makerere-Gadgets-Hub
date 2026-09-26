import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Category } from '../../types';

interface ProductFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: Category[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  dealsOnly: boolean;
  setDealsOnly: (val: boolean) => void;
  totalProductsCount: number;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  sortBy,
  setSortBy,
  inStockOnly,
  setInStockOnly,
  dealsOnly,
  setDealsOnly,
  totalProductsCount,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chargers, earbuds, extensions, hot plates..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="popular">Popular & Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="discount">Biggest Discount</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* In Stock Filter */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500 h-3.5 w-3.5"
            />
            <span className="text-slate-700 font-medium">In Stock</span>
          </label>

          {/* Student Deals Filter */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={dealsOnly}
              onChange={(e) => setDealsOnly(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500 h-3.5 w-3.5"
            />
            <span className="text-red-600 font-medium">Deals Only</span>
          </label>

          {/* Total Results Count */}
          <span className="text-slate-400 ml-auto tabular-nums hidden sm:inline">
            {totalProductsCount} {totalProductsCount === 1 ? 'gadget' : 'gadgets'}
          </span>
        </div>

      </div>
    </div>
  );
};
