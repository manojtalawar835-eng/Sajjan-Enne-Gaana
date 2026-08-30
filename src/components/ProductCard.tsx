import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Check, Plus, Minus, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateToProduct,
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizeOptions[0]?.size || product.defaultSize
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedRecently, setIsAddedRecently] = useState<boolean>(false);

  const currentOption =
    product.sizeOptions.find((opt) => opt.size === selectedSize) ||
    product.sizeOptions[0];

  const currentPrice = currentOption ? currentOption.price : 200;
  const originalPrice = currentOption?.originalPrice;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable || product.stock <= 0) return;
    addToCart(product, selectedSize, quantity);
    setIsAddedRecently(true);
    setTimeout(() => {
      setIsAddedRecently(false);
    }, 1500);
  };

  const handleSizeClick = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleQtyChange = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product.stock || 10)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative bg-white dark:bg-zinc-900 border rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col ${
        !product.isAvailable || product.stock <= 0
          ? 'border-zinc-300 dark:border-zinc-800 opacity-80'
          : 'border-[#1B5E20]/10 hover:border-[#D4A017]'
      }`}
    >
      {/* Top Badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          {product.category === 'edible_oil' ? (
            <span className="bg-[#1B5E20] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-xs tracking-wider uppercase">
              Cold Pressed
            </span>
          ) : (
            <span className="bg-[#D4A017] text-zinc-950 text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-xs tracking-wider uppercase">
              Cattle Feed
            </span>
          )}

          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-md flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-rose-600 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-[#1B5E20]/10"
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Area */}
      <div
        onClick={() => navigateToProduct(product.id)}
        className="relative w-full aspect-[4/5] bg-[#FFF8E8] dark:bg-zinc-950/60 p-5 flex items-center justify-center cursor-pointer overflow-hidden group/img"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover/img:scale-108 transition-transform duration-500 drop-shadow-md"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/LOGO.png';
          }}
        />

        {(!product.isAvailable || product.stock <= 0) && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and category */}
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
            <span className="font-semibold text-[#D4A017] uppercase tracking-wider text-[10px]">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-[#D4A017] font-semibold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-[#D4A017]" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-zinc-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => navigateToProduct(product.id)}
            className="font-serif font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 hover:text-[#1B5E20] dark:hover:text-[#D4A017] transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {product.kannadaName && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 font-medium mt-0.5">
              {product.kannadaName}
            </p>
          )}

          {/* Size Variant Selector Buttons */}
          <div className="mt-3">
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1.5">
              Select Quantity / Size:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.sizeOptions.map((opt) => {
                const isSelected = opt.size === selectedSize;
                return (
                  <button
                    key={opt.size}
                    type="button"
                    onClick={(e) => handleSizeClick(opt.size, e)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-xs'
                        : 'bg-[#FFF8E8]/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-[#1B5E20]/15 hover:border-[#1B5E20]'
                    }`}
                  >
                    {opt.size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {/* Dynamic Price Display */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold font-serif text-[#1B5E20] dark:text-[#81C784]">
              ₹{currentPrice}
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-xs text-zinc-400 line-through">
                ₹{originalPrice}
              </span>
            )}
            <span className="text-[11px] text-[#D4A017] font-semibold ml-auto">
              {product.stock > 0 ? `${product.stock} available` : 'Restocking soon'}
            </span>
          </div>

          {/* Quantity Selector & Add to Cart Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[#1B5E20]/20 dark:border-zinc-700 rounded-full bg-[#FFF8E8]/50 dark:bg-zinc-800 p-0.5">
              <button
                type="button"
                onClick={(e) => handleQtyChange(-1, e)}
                disabled={quantity <= 1 || !product.isAvailable}
                className="w-7 h-7 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 disabled:opacity-30 rounded-full cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => handleQtyChange(1, e)}
                disabled={quantity >= product.stock || !product.isAvailable}
                className="w-7 h-7 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 disabled:opacity-30 rounded-full cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.isAvailable || product.stock <= 0}
              className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer ${
                isAddedRecently
                  ? 'bg-[#D4A017] text-zinc-950 shadow-md'
                  : 'bg-[#1B5E20] hover:bg-[#154a19] text-white disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500'
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
