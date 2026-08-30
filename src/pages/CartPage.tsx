import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  X,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryCharge,
    discountAmount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    storeConfig,
    setCurrentView,
    coupons,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponFeedback({ message: res.message, isError: true });
    } else {
      setCouponFeedback({ message: res.message, isError: false });
      setCouponInput('');
    }
  };

  const amountNeededForFreeDelivery = Math.max(
    0,
    storeConfig.minOrderForFreeDelivery - cartSubtotal
  );
  const freeDeliveryProgress = Math.min(
    100,
    (cartSubtotal / storeConfig.minOrderForFreeDelivery) * 100
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-zinc-900 border border-[#D4A017]/30 rounded-3xl p-10 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-[#1B5E20]/10 text-[#1B5E20] dark:text-[#81C784] rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-['Poppins']">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Explore our pure cold pressed oils and nutritious oil cakes fresh from the mill!
          </p>
          <button
            onClick={() => {
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setCurrentView('products')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5E20] dark:text-[#81C784] mb-1 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Shopping
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Poppins'] text-zinc-900 dark:text-zinc-100">
            Your Shopping Cart
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold self-start sm:self-auto cursor-pointer"
        >
          Clear All Items
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#1B5E20] dark:text-[#81C784]" />
            {amountNeededForFreeDelivery === 0 ? (
              <strong className="text-[#1B5E20] dark:text-emerald-400">🎉 Congratulations! You have unlocked FREE Delivery!</strong>
            ) : (
              <>Add <strong className="text-[#1B5E20] dark:text-emerald-300">₹{amountNeededForFreeDelivery}</strong> more to qualify for <strong>FREE Delivery</strong></>
            )}
          </span>
          <span>₹{cartSubtotal} / ₹{storeConfig.minOrderForFreeDelivery}</span>
        </div>
        <div className="w-full h-2 bg-emerald-200/50 dark:bg-emerald-900/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B5E20] dark:bg-[#81C784] transition-all duration-500 rounded-full"
            style={{ width: `${freeDeliveryProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center gap-4 transition-all"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-24 bg-[#FEFBF3] dark:bg-zinc-950 rounded-xl p-2 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="max-h-full object-contain drop-shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/LOGO.png';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 truncate">
                    {item.productName}
                  </h3>
                  <div className="inline-block bg-[#1B5E20]/10 dark:bg-[#1B5E20]/30 text-[#1B5E20] dark:text-[#81C784] text-xs font-bold px-2 py-0.5 rounded-md mt-1">
                    Pack: {item.size}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Unit Price: ₹{item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 p-0.5 shrink-0">
                  <button
                    onClick={() => updateCartQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 rounded-lg cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 rounded-lg cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Item Total & Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <span className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 font-['Poppins']">
                    ₹{item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-[#D4A017]/30 rounded-3xl p-6 shadow-md space-y-5">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-['Poppins'] pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Order Summary
            </h2>

            {/* Coupon Application */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Have a Coupon Code?
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1B5E20] dark:text-[#81C784]">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{appliedCoupon.code} ({appliedCoupon.discountPercentage}% OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-zinc-400 hover:text-rose-600 p-1"
                    title="Remove Coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponFeedback(null);
                    }}
                    placeholder="e.g. PURE10"
                    className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-[#FFF8E8]/40 dark:bg-zinc-800 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponFeedback && (
                <p
                  className={`text-[11px] mt-1.5 ${
                    couponFeedback.isError ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {couponFeedback.message}
                </p>
              )}

              {/* Available Coupons list */}
              {!appliedCoupon && coupons.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-[10px] text-zinc-400 font-medium">Available Offers:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {coupons
                      .filter((c) => c.isActive)
                      .map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            applyCoupon(c.code);
                          }}
                          className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-[#D4A017]/40 text-[#1B5E20] dark:text-[#D4A017] text-[10px] font-bold hover:bg-amber-100 cursor-pointer"
                        >
                          {c.code} ({c.discountPercentage}% OFF)
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">₹{cartSubtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {deliveryCharge === 0 ? (
                    <span className="text-[#1B5E20] dark:text-[#81C784] font-bold">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Total Payable</span>
                <span className="text-2xl font-extrabold text-[#1B5E20] dark:text-[#81C784] font-['Poppins']">
                  ₹{cartTotal}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                setCurrentView('checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-4 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#D4A017]" />
            </button>

            <p className="text-[11px] text-center text-zinc-400">
              🔒 Safe & Secure Checkout • UPI / COD Supported
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
