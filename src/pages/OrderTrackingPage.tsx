import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { jsPDF } from 'jspdf';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  FileText,
  Phone,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

export const OrderTrackingPage: React.FC = () => {
  const {
    orders,
    trackingOrderId,
    setTrackingOrderId,
    currentUser,
    storeConfig,
    showToast,
  } = useStore();

  const [inputOrderId, setInputOrderId] = useState(trackingOrderId || '');

  const activeOrder =
    orders.find((o) => o.id.toLowerCase() === inputOrderId.trim().toLowerCase()) ||
    (trackingOrderId ? orders.find((o) => o.id === trackingOrderId) : null) ||
    orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputOrderId.trim()) return;
    const found = orders.find(
      (o) => o.id.toLowerCase() === inputOrderId.trim().toLowerCase()
    );
    if (!found) {
      showToast('Order Not Found', `No order found with ID ${inputOrderId}`, 'error');
    } else {
      setTrackingOrderId(found.id);
    }
  };

  const steps = [
    { label: 'Order Placed', desc: 'Order received at mill' },
    { label: 'Confirmed', desc: 'Fresh seed batch allocated' },
    { label: 'Packed & Bottled', desc: 'Cold pressed & seal packed' },
    { label: 'Out for Delivery', desc: 'Dispatched with logistics' },
    { label: 'Delivered', desc: 'Delivered to your doorstep' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Packed':
        return 2;
      case 'Dispatched':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 0;

  // Generate & Download PDF Invoice
  const handleDownloadInvoice = () => {
    if (!activeOrder) return;

    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(27, 94, 32); // #1B5E20
      doc.text('SAJJAN ENNE GANA', 20, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('100% Cold Pressed Edible Oils & Pure Oil Cakes', 20, 28);
      doc.text(`Phone: ${storeConfig.contactPhone} | Instagram: @sajjan_yanne_gaana`, 20, 33);

      doc.setDrawColor(212, 160, 23); // Golden divider
      doc.setLineWidth(1);
      doc.line(20, 38, 190, 38);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`TAX INVOICE: #${activeOrder.id}`, 20, 48);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Date: ${activeOrder.createdAt}`, 20, 55);
      doc.text(`Payment: ${activeOrder.paymentMethod} (${activeOrder.paymentStatus})`, 20, 61);

      // Customer Details Box
      doc.setFont('helvetica', 'bold');
      doc.text('Customer & Delivery Details:', 120, 48);
      doc.setFont('helvetica', 'normal');
      doc.text(activeOrder.address.fullName, 120, 55);
      doc.text(`${activeOrder.address.streetAddress}`, 120, 61);
      doc.text(`${activeOrder.address.city}, ${activeOrder.address.state} - ${activeOrder.address.pincode}`, 120, 67);
      doc.text(`Phone: ${activeOrder.address.phone}`, 120, 73);

      // Items Table Header
      let y = 88;
      doc.setFillColor(27, 94, 32);
      doc.rect(20, y, 170, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('Item Description', 25, y + 6);
      doc.text('Pack', 110, y + 6);
      doc.text('Qty', 135, y + 6);
      doc.text('Amount (INR)', 160, y + 6);

      y += 12;
      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'normal');

      activeOrder.items.forEach((item) => {
        doc.text(item.productName, 25, y);
        doc.text(item.size, 110, y);
        doc.text(item.quantity.toString(), 135, y);
        doc.text(`Rs. ${item.totalPrice}`, 160, y);
        y += 8;
      });

      doc.line(20, y, 190, y);
      y += 6;

      doc.setFont('helvetica', 'bold');
      doc.text(`Subtotal: Rs. ${activeOrder.subtotal}`, 135, y);
      y += 6;
      if (activeOrder.discount > 0) {
        doc.text(`Discount: -Rs. ${activeOrder.discount}`, 135, y);
        y += 6;
      }
      doc.text(`Delivery: Rs. ${activeOrder.deliveryCharge}`, 135, y);
      y += 8;
      doc.setFontSize(12);
      doc.setTextColor(27, 94, 32);
      doc.text(`Grand Total: Rs. ${activeOrder.total}`, 135, y);

      y += 20;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 120);
      doc.text('Thank you for choosing pure health with Sajjan Enne Gana!', 20, y);
      doc.text('Authentic traditional wooden ghani extracted oils.', 20, y + 5);

      doc.save(`Invoice_SajjanEnneGana_${activeOrder.id}.pdf`);
      showToast('Invoice Downloaded', 'PDF invoice saved to your device', 'success');
    } catch (e) {
      console.error(e);
      showToast('Invoice Error', 'Could not generate PDF invoice', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Order Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-[#D4A017]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4A017]">
            Real-Time Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Poppins'] text-zinc-900 dark:text-zinc-100 mt-1">
            Track Your Fresh Oil Order
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Enter your Order ID below to view live milling, packing, and courier updates.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value)}
              placeholder="e.g. SEG-98421"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-[#FFF8E8]/50 dark:bg-zinc-800 text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
            />
          </div>
          <button
            type="submit"
            className="py-3 px-6 bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Track Status
          </button>
        </form>

        {/* Quick select from recent orders */}
        {orders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-zinc-500">
            <span>Recent Orders:</span>
            {orders.slice(0, 4).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setInputOrderId(o.id);
                  setTrackingOrderId(o.id);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold transition-all cursor-pointer ${
                  activeOrder?.id === o.id
                    ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-[#1B5E20]'
                }`}
              >
                #{o.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Order Tracking Details */}
      {activeOrder && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-md space-y-8">
          {/* Top Order Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Order ID:</span>
                <span className="font-mono text-base font-extrabold text-[#1B5E20] dark:text-[#81C784]">
                  #{activeOrder.id}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    activeOrder.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : activeOrder.status === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {activeOrder.status}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Placed on {activeOrder.createdAt} • Estimated: {activeOrder.estimatedDelivery}
              </p>
            </div>

            <button
              onClick={handleDownloadInvoice}
              className="py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
            >
              <FileText className="w-4 h-4 text-[#1B5E20] dark:text-[#81C784]" />
              <span>Download PDF Invoice</span>
            </button>
          </div>

          {/* 5-Step Visual Timeline */}
          {activeOrder.status !== 'Cancelled' ? (
            <div className="py-4">
              <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-0">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute top-5 left-10 right-10 h-1 bg-zinc-200 dark:bg-zinc-800 z-0">
                  <div
                    className="h-full bg-[#1B5E20] transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%`,
                    }}
                  ></div>
                </div>

                {steps.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div
                      key={step.label}
                      className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center flex-1"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                          isDone
                            ? 'bg-[#1B5E20] text-white shadow-md'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-300 dark:border-zinc-700'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div>
                        <p
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-[#1B5E20] dark:text-[#81C784]'
                              : isDone
                              ? 'text-zinc-900 dark:text-zinc-100'
                              : 'text-zinc-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[10px] text-zinc-500 hidden sm:block">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-3 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>This order has been cancelled. For queries, contact our support team at +91 82178 46338.</span>
            </div>
          )}

          {/* Delivery & Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            {/* Delivery address */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
                Delivery Address:
              </h4>
              <p className="font-bold text-zinc-800 dark:text-zinc-200">{activeOrder.address.fullName}</p>
              <p className="text-zinc-600 dark:text-zinc-400">{activeOrder.address.streetAddress}</p>
              <p className="text-zinc-600 dark:text-zinc-400">
                {activeOrder.address.city}, {activeOrder.address.state} - {activeOrder.address.pincode}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">Phone: {activeOrder.address.phone}</p>
            </div>

            {/* Ordered Items summary */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
                Items in Order:
              </h4>
              <div className="space-y-1.5">
                {activeOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-zinc-700 dark:text-zinc-300">
                    <span>
                      {item.quantity}x {item.productName} ({item.size})
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-[#1B5E20] dark:text-[#81C784]">₹{activeOrder.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
