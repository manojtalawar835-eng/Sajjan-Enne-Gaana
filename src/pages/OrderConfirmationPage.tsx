import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ArrowRight,
  Truck,
  Sparkles,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'motion/react';

export const OrderConfirmationPage: React.FC = () => {
  const {
    lastConfirmedOrder,
    setCurrentView,
    setTrackingOrderId,
  } = useStore();

  useEffect(() => {
    // Blast festive gold and emerald confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1B5E20', '#D4A017', '#2E7D32', '#FFF8E8'],
      });
    } catch (e) {
      console.log('Confetti error', e);
    }
  }, []);

  const order = lastConfirmedOrder;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-zinc-500">No active order found.</p>
        <button
          onClick={() => setCurrentView('products')}
          className="mt-4 px-4 py-2 bg-[#1B5E20] text-white rounded-xl text-xs font-bold"
        >
          Explore Products
        </button>
      </div>
    );
  }

  const handleTrackOrder = () => {
    setTrackingOrderId(order.id);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Celebration Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 border-2 border-[#1B5E20] rounded-3xl p-6 sm:p-10 text-center shadow-xl relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#D4A017]/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#1B5E20] dark:text-[#81C784] mb-4 border-2 border-[#1B5E20]/30 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="bg-[#D4A017] text-zinc-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider block w-max mx-auto mb-2">
          Order Successfully Placed!
        </span>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-['Poppins'] text-zinc-900 dark:text-zinc-100">
          Thank you, {order.customerName}!
        </h1>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto mt-2">
          Your order for pure cold pressed oils has been received at our mill. Fresh bottling and packing will start immediately.
        </p>

        {/* Order ID Badge */}
        <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#FFF8E8] dark:bg-zinc-800 border border-[#D4A017]/40 shadow-xs">
          <span className="text-xs text-zinc-500 font-medium">Your Order ID:</span>
          <span className="font-mono text-base font-extrabold text-[#1B5E20] dark:text-[#81C784] tracking-wider">
            #{order.id}
          </span>
        </div>

        {/* Notifications confirmation */}
        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            SMS confirmation sent to {order.customerPhone}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleTrackOrder}
            className="py-3 px-6 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-[#D4A017]" />
            <span>Track Order Status</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="py-3 px-6 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
          >
            <span>Continue Shopping</span>
          </button>
        </div>
      </motion.div>

      {/* Order Summary & Receipt Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping & Delivery Details */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-['Poppins'] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1B5E20]" />
            <span>Delivery Information</span>
          </h3>

          <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 leading-relaxed">
            <p className="font-bold text-zinc-900 dark:text-zinc-100">{order.address.fullName}</p>
            <p>{order.address.streetAddress}</p>
            {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
            <p>
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
            <p className="pt-1 font-semibold text-zinc-800 dark:text-zinc-200">
              Phone: {order.address.phone}
            </p>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 text-xs font-semibold text-[#1B5E20] dark:text-[#81C784]">
            <Calendar className="w-4 h-4" />
            <span>Estimated Delivery: {order.estimatedDelivery}</span>
          </div>
        </div>

        {/* Payment & Items Receipt */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-['Poppins'] flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#1B5E20]" />
            <span>Payment & Items</span>
          </h3>

          <div className="text-xs space-y-2">
            <div className="flex justify-between text-zinc-500">
              <span>Payment Mode:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Payment Status:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{order.paymentStatus}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[200px]">
                  {item.quantity}x {item.productName} ({item.size})
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  ₹{item.totalPrice}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-baseline">
            <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Total Paid / Payable:</span>
            <span className="font-extrabold text-lg text-[#1B5E20] dark:text-[#81C784] font-['Poppins']">
              ₹{order.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
