import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  ShieldCheck,
  Droplets,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  Leaf,
  Sparkles,
  Share2,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
    storeConfig,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizeOptions[0]?.size || product?.defaultSize || '1L'
  );
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-zinc-500">Product not found.</p>
        <button
          onClick={() => setCurrentView('products')}
          className="mt-4 px-4 py-2 bg-[#1B5E20] text-white rounded-xl text-xs font-bold"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const currentOption =
    product.sizeOptions.find((opt) => opt.size === selectedSize) ||
    product.sizeOptions[0];

  const currentPrice = currentOption ? currentOption.price : 200;
  const originalPrice = currentOption?.originalPrice;
  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!product.isAvailable || product.stock <= 0) return;
    addToCart(product, selectedSize, quantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} from Sajjan Enne Gana!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to clipboard', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to Products Navigation */}
      <button
        onClick={() => {
          setCurrentView('products');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1B5E20] dark:text-[#81C784] hover:text-[#D4A017] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-3xl border border-[#D4A017]/30 shadow-md">
        {/* Left Column: Image Area */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full aspect-[4/5] bg-[#FEFBF3] dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-center relative overflow-hidden shadow-inner">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/LOGO.png';
              }}
            />

            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-zinc-800 shadow-md hover:scale-110 active:scale-95 transition-all text-zinc-600 dark:text-zinc-300 hover:text-rose-500"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          <div className="w-full mt-4 flex items-center justify-between text-xs text-zinc-500 px-2">
            <span className="flex items-center gap-1 text-[#1B5E20] dark:text-[#81C784] font-semibold">
              <Leaf className="w-4 h-4" />
              100% Unadulterated
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-zinc-900 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Product
            </button>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#1B5E20] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-zinc-400">({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-['Poppins'] text-zinc-900 dark:text-zinc-100">
              {product.name}
            </h1>

            {product.kannadaName && (
              <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                {product.kannadaName}
              </p>
            )}

            <p className="text-xs font-semibold text-[#D4A017] dark:text-amber-400 mt-2">
              {product.shortBenefit}
            </p>
          </div>

          {/* Dynamic Price */}
          <div className="p-4 rounded-2xl bg-[#FFF8E8] dark:bg-zinc-800/60 border border-[#D4A017]/30 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-['Poppins']">
              ₹{currentPrice}
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-base text-zinc-400 line-through">
                ₹{originalPrice}
              </span>
            )}
            <span className="text-xs font-semibold text-[#1B5E20] dark:text-[#81C784] ml-auto">
              {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Size Options Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
              Select Package Size / Volume:
            </label>
            <div className="flex flex-wrap gap-2.5">
              {product.sizeOptions.map((opt) => {
                const isSelected = opt.size === selectedSize;
                return (
                  <button
                    key={opt.size}
                    type="button"
                    onClick={() => setSelectedSize(opt.size)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md scale-102'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:border-[#1B5E20]'
                    }`}
                  >
                    <span>{opt.size}</span>
                    <span className="block text-[11px] font-normal opacity-90">₹{opt.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 p-1">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 disabled:opacity-30 rounded-lg cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(prev + 1, product.stock || 10))}
                disabled={quantity >= product.stock}
                className="w-9 h-9 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 disabled:opacity-30 rounded-lg cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable || product.stock <= 0}
              className="flex-1 py-3.5 px-6 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4A017]" />
              <span>Add to Cart (₹{currentPrice * quantity})</span>
            </button>
          </div>

          {/* Highlights & Features */}
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                Description & Benefits
              </h4>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.nutritionalHighlights && product.nutritionalHighlights.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Nutritional Highlights
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {product.nutritionalHighlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#1B5E20] dark:text-[#81C784] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-[#1B5E20] dark:text-emerald-300">
              <Truck className="w-4 h-4 shrink-0" />
              <span>
                Free shipping on orders above ₹{storeConfig.minOrderForFreeDelivery}! Delivered safely in leak-proof packaging.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
