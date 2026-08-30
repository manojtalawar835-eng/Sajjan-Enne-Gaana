import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, OrderAddress } from '../types';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Upload,
  Copy,
  Check,
  CheckCircle2,
  Lock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryCharge,
    discountAmount,
    cartTotal,
    appliedCoupon,
    storeConfig,
    createOrder,
    currentUser,
    setCurrentView,
    showToast,
  } = useStore();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Hubballi');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('580020');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI / PhonePe');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [isCopiedUpi, setIsCopiedUpi] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Generate dynamic UPI payment URI and QR code
  const upiUri = `upi://pay?pa=${encodeURIComponent(storeConfig.upiId)}&pn=${encodeURIComponent(
    storeConfig.shopName
  )}&am=${cartTotal}&cu=INR&tn=${encodeURIComponent('SajjanEnneGana Order')}`;

  useEffect(() => {
    if (cartTotal > 0 && storeConfig.upiId) {
      QRCode.toDataURL(upiUri, {
        width: 250,
        margin: 2,
        color: {
          dark: '#1B5E20',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('QR generation failed', err));
    }
  }, [upiUri, cartTotal, storeConfig.upiId]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(storeConfig.upiId);
    setIsCopiedUpi(true);
    showToast('UPI ID Copied', storeConfig.upiId, 'info');
    setTimeout(() => setIsCopiedUpi(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result as string);
        showToast('Screenshot Uploaded', 'Payment proof attached to your order', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Empty Cart', 'Please add products to your cart before checkout', 'error');
      setCurrentView('products');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !streetAddress.trim() || !pincode.trim()) {
      showToast('Incomplete Address', 'Please fill in all mandatory address details', 'error');
      return;
    }

    setIsSubmitting(true);

    const address: OrderAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      streetAddress: streetAddress.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    };

    setTimeout(() => {
      createOrder({
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        address,
        paymentMethod,
        paymentScreenshot: paymentScreenshot || undefined,
        transactionRef: transactionRef.trim() || undefined,
      });
      setIsSubmitting(false);
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-zinc-500">Your cart is empty.</p>
        <button
          onClick={() => setCurrentView('products')}
          className="mt-4 px-4 py-2 bg-[#1B5E20] text-white rounded-xl text-xs font-bold"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('cart')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5E20] dark:text-[#81C784] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Shopping Cart
      </button>

      <div className="border-b border-[#D4A017]/30 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-['Poppins'] text-zinc-900 dark:text-zinc-100">
          Delivery Address & Payment
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Complete your order for 100% pure cold pressed oils and fresh mill products
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Address and Customer Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Contact and Shipping Address */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Truck className="w-5 h-5 text-[#1B5E20] dark:text-[#81C784]" />
              <h2 className="text-base font-bold font-['Poppins']">1. Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Phone Number (for delivery OTP/calls) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address (for invoice receipt)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Complete Street Address / House / Farm No *
                </label>
                <textarea
                  rows={2}
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="House #104, 2nd Main, Garden Layout"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near Water Tank / Temple"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="580020"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <CreditCard className="w-5 h-5 text-[#1B5E20] dark:text-[#81C784]" />
              <h2 className="text-base font-bold font-['Poppins']">2. Payment Method</h2>
            </div>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Dynamic UPI / PhonePe */}
              <div
                onClick={() => setPaymentMethod('UPI / PhonePe')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'UPI / PhonePe'
                    ? 'border-[#1B5E20] bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#1B5E20] dark:text-[#81C784]" />
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      UPI / PhonePe / GPay
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold bg-[#D4A017] text-zinc-950 px-2 py-0.5 rounded-full">
                    Instant
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Scan Dynamic QR with PhonePe, Google Pay, Paytm, BHIM, or any UPI app.
                </p>
              </div>

              {/* Option 2: Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-[#1B5E20] bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-[#1B5E20] dark:text-[#81C784]" />
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      Cash on Delivery
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-500">
                  Pay cash directly when our delivery partner delivers your parcel.
                </p>
              </div>
            </div>

            {/* UPI Dynamic QR and Owner Details Section */}
            {paymentMethod === 'UPI / PhonePe' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-br from-[#FEFBF3] to-amber-50 dark:from-zinc-800/80 dark:to-zinc-800/40 p-5 rounded-2xl border border-[#D4A017]/40 space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Dynamic QR Code */}
                  <div className="bg-white p-3 rounded-2xl shadow-md border border-zinc-200 shrink-0 text-center">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="Dynamic UPI Payment QR Code"
                        className="w-44 h-44 object-contain mx-auto"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-xs text-zinc-400">
                        Generating QR...
                      </div>
                    )}
                    <p className="text-[10px] font-bold text-[#1B5E20] mt-1 uppercase tracking-wide">
                      Scan to Pay ₹{cartTotal}
                    </p>
                  </div>

                  {/* Owner Configured Bank & UPI Details */}
                  <div className="flex-1 space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 w-full">
                    <div>
                      <span className="text-[11px] text-zinc-500 block">Sajjan Enne Gana UPI ID:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono font-bold text-sm bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-[#1B5E20] dark:text-[#81C784]">
                          {storeConfig.upiId}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 text-zinc-700 dark:text-zinc-200 transition-colors"
                          title="Copy UPI ID"
                        >
                          {isCopiedUpi ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-zinc-400">Bank Name:</span>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{storeConfig.bankName}</p>
                      </div>
                      <div>
                        <span className="text-zinc-400">Account Holder:</span>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{storeConfig.accountHolder}</p>
                      </div>
                      <div>
                        <span className="text-zinc-400">Account Number:</span>
                        <p className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{storeConfig.accountNumber}</p>
                      </div>
                      <div>
                        <span className="text-zinc-400">IFSC Code:</span>
                        <p className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{storeConfig.ifscCode}</p>
                      </div>
                    </div>

                    {/* Deep links for mobile apps */}
                    <div className="pt-2">
                      <a
                        href={upiUri}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5E20] dark:text-[#D4A017] hover:underline"
                      >
                        <span>Open in PhonePe / GPay App directly</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Optional Screenshot & Transaction ID attachment */}
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                        UPI UTR / Transaction Ref (Optional)
                      </label>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. 504829104820"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                        Upload Payment Screenshot (Optional)
                      </label>
                      <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 cursor-pointer text-xs text-zinc-600 dark:text-zinc-300">
                        <Upload className="w-3.5 h-3.5 text-[#1B5E20]" />
                        <span>{paymentScreenshot ? 'Screenshot Selected ✓' : 'Choose File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Order Items Summary & Confirm CTA */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-zinc-900 border border-[#D4A017]/30 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 font-['Poppins'] pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Items in Order ({cart.length})
            </h3>

            {/* List of items */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-zinc-100 dark:divide-zinc-800">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-12 object-contain bg-[#FEFBF3] dark:bg-zinc-950 p-1 rounded-md shrink-0 border border-zinc-100"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{item.productName}</p>
                      <p className="text-[11px] text-zinc-500">
                        {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Calculations */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">₹{cartSubtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryCharge}`}
                </span>
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline">
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Total Bill</span>
                <span className="text-2xl font-extrabold text-[#1B5E20] dark:text-[#81C784] font-['Poppins']">
                  ₹{cartTotal}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-[#D4A017]" />
                  <span>Place Order • ₹{cartTotal}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 text-center">
              <Lock className="w-3.5 h-3.5" />
              <span>Tamper-proof bottle seals & automated SMS confirmation</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
