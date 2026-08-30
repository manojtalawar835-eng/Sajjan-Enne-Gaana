import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  History,
  Sparkles,
  Droplets,
  Wheat,
  RotateCcw,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDashboard: React.FC = () => {
  const {
    products,
    currentUser,
    orders,
    addToCart,
    setCurrentView,
    recentlyViewedIds,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  // Customer recent orders for instant "Repeat Previous Order"
  const customerOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter(
      (o) =>
        o.userId === currentUser.id ||
        o.customerPhone.includes(currentUser.phone) ||
        (currentUser.email && o.customerEmail === currentUser.email)
    );
  }, [currentUser, orders]);

  const latestOrder = customerOrders[0];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' ? true : p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.kannadaName && p.kannadaName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const priceA = a.sizeOptions[0]?.price || 0;
        const priceB = b.sizeOptions[0]?.price || 0;

        if (sortBy === 'price_low') return priceA - priceB;
        if (sortBy === 'price_high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Recently viewed products
  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);
  }, [recentlyViewedIds, products]);

  const handleReorder = () => {
    if (!latestOrder) return;
    latestOrder.items.forEach((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (p) {
        addToCart(p, item.size, item.quantity);
      }
    });
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner for Customer */}
      <div className="bg-gradient-to-r from-[#1B5E20] via-[#206926] to-[#1B5E20] text-white p-6 sm:p-10 rounded-3xl shadow-xl border border-[#D4A017]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#D4A017] text-zinc-950 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">
              {currentUser ? 'Member Dashboard' : 'Fresh Mill Stock'}
            </span>
            <span className="text-emerald-200 text-xs font-medium">Daily Cold Pressed Batches</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight text-amber-50">
            {currentUser ? `Namaskara, ${currentUser.name}!` : 'Sajjan Enne Gana Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl font-sans leading-relaxed">
            Pure Mara Chekku cold pressed edible oils and nutrient-packed organic oil cakes. Select your size & quantity below.
          </p>
        </div>

        {/* Quick Reorder Widget if customer has past orders */}
        {latestOrder && (
          <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/20 flex items-center gap-4 shrink-0">
            <div>
              <p className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider">Last Order: #{latestOrder.id}</p>
              <p className="text-sm font-bold font-serif text-white">
                {latestOrder.items.length} item(s) • ₹{latestOrder.total}
              </p>
            </div>
            <button
              onClick={handleReorder}
              className="py-2.5 px-4 bg-[#D4A017] hover:bg-[#c58f10] text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repeat</span>
            </button>
          </div>
        )}
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-3xl border border-[#1B5E20]/10 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groundnut oil, safflower..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-[#1B5E20]/20 bg-[#FFF8E8]/40 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] dark:focus:ring-[#D4A017]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#1B5E20] text-white shadow-sm'
                  : 'bg-[#FFF8E8] dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-[#1B5E20]/10 hover:border-[#1B5E20]'
              }`}
            >
              All Items ({products.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('edible_oil')}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'edible_oil'
                  ? 'bg-[#1B5E20] text-white shadow-sm'
                  : 'bg-[#FFF8E8] dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-[#1B5E20]/10 hover:border-[#1B5E20]'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>Cold Pressed Oils</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('oil_cake')}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'oil_cake'
                  ? 'bg-[#1B5E20] text-white shadow-sm'
                  : 'bg-[#FFF8E8] dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-[#1B5E20]/10 hover:border-[#1B5E20]'
              }`}
            >
              <Wheat className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>Cattle Feed Cakes</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <ArrowUpDown className="w-4 h-4 text-zinc-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-full border border-[#1B5E20]/20 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
            >
              <option value="featured">Featured First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">No products found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search keyword or selected category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="py-2 px-4 bg-[#1B5E20] text-white text-xs font-bold rounded-xl mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Recently Viewed Strip */}
      {recentlyViewedProducts.length > 0 && (
        <div className="pt-8 border-t border-[#D4A017]/20 space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#D4A017]" />
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              Recently Viewed Products
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {recentlyViewedProducts.slice(0, 6).map((item) => {
              if (!item) return null;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentView('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-[#1B5E20] transition-colors cursor-pointer group text-center flex flex-col items-center"
                >
                  <div className="w-16 h-20 bg-[#FEFBF3] dark:bg-zinc-950 rounded-lg p-1 flex items-center justify-center mb-1.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[10px] font-semibold text-[#1B5E20] dark:text-[#81C784]">
                    ₹{item.sizeOptions[0]?.price}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
