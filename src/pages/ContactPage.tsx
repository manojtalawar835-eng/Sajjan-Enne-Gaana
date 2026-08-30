import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Phone,
  Instagram,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { storeConfig, showToast } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [inquiryType, setInquiryType] = useState('Household Order');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('Please fill all fields', 'Name, phone and message are required', 'error');
      return;
    }

    // Direct to WhatsApp
    const waText = encodeURIComponent(
      `*New Inquiry for Sajjan Enne Gana*\n*Type:* ${inquiryType}\n*Name:* ${name}\n*Phone:* ${phone}\n*Message:* ${message}`
    );
    window.open(`https://wa.me/918217846338?text=${waText}`, '_blank');
    showToast('Inquiry Sent', 'Opening WhatsApp to complete your message to Sajjan Enne Gana', 'success');

    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="bg-[#1B5E20]/10 text-[#1B5E20] dark:text-[#81C784] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#1B5E20]/20">
          Direct Mill Contact
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
          Get in Touch with Sajjan Enne Gana
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
          Whether you need 1 Liter for your kitchen or 50kg bulk bags for cattle feed & commercial kitchens, our team is happy to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-[#1B5E20]/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-zinc-100 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Mill Information
            </h3>

            <div className="space-y-4 text-xs">
              <a
                href="tel:+918217846338"
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFF8E8]/60 dark:bg-zinc-800/60 hover:bg-[#1B5E20]/10 transition-colors group border border-[#1B5E20]/10"
              >
                <div className="w-10 h-10 rounded-full bg-[#1B5E20]/10 text-[#1B5E20] dark:text-[#81C784] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Call / WhatsApp Phone</p>
                  <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-[#1B5E20]">
                    +91 82178 46338
                  </p>
                  <p className="text-[11px] text-zinc-500">Available 8:00 AM - 8:30 PM</p>
                </div>
              </a>

              <a
                href="https://instagram.com/sajjan_yanne_gaana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFF8E8]/60 dark:bg-zinc-800/60 hover:bg-[#D4A017]/10 transition-colors group border border-[#1B5E20]/10"
              >
                <div className="w-10 h-10 rounded-full bg-[#D4A017]/10 text-[#D4A017] flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Official Instagram</p>
                  <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-[#D4A017]">
                    @sajjan_yanne_gaana
                  </p>
                  <p className="text-[11px] text-zinc-500">Watch live extraction reels & updates</p>
                </div>
              </a>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFF8E8]/60 dark:bg-zinc-800/60 border border-[#1B5E20]/10">
                <div className="w-10 h-10 rounded-full bg-[#1B5E20]/10 text-[#1B5E20] dark:text-[#81C784] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Operating Hours</p>
                  <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    Monday - Saturday: 8:00 AM – 8:30 PM
                  </p>
                  <p className="text-[11px] text-zinc-500">Sunday: 9:00 AM – 2:00 PM</p>
                </div>
              </div>
            </div>

            {/* Google Maps Location Box */}
            <div className="p-5 rounded-3xl bg-[#FFF8E8] dark:bg-zinc-800/80 border border-[#D4A017]/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-zinc-900 dark:text-zinc-100">
                <MapPin className="w-4 h-4 text-[#D4A017]" />
                <span>Visit Our Physical Mill Location</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Watch traditional wooden Mara Chekku expellers press fresh batches live. Bring your own bottles or purchase ready food-grade packs.
              </p>
              <a
                href={storeConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-center"
              >
                <span>Open Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4A017]" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-[#1B5E20]/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-zinc-100">
              Send us a Message or Bulk Order Inquiry
            </h3>
            <p className="text-xs text-zinc-500 font-sans mt-1">
              Submit below to connect directly with our mill master over WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Inquiry Type
              </label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-[#FFF8E8]/40 dark:bg-zinc-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
              >
                <option value="Household Order">Household Cooking Oil Order</option>
                <option value="Cattle Feed Bulk Order">Cattle Feed / Oil Cake Bulk Purchase</option>
                <option value="Commercial & Catering">Restaurant / Catering Bulk Supply</option>
                <option value="Mill Visit Booking">Mill Visit & Demo Inquiry</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand"
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-[#FFF8E8]/40 dark:bg-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 82178..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-[#FFF8E8]/40 dark:bg-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Your Message / Product Quantity Required *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. I want to inquire about 15 Liters of Groundnut Oil and 2 bags of Cotton Seed Oil Cake."
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-[#FFF8E8]/40 dark:bg-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#D4A017]" />
              <span>Send Message to WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
