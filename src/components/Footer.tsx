import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Phone,
  Instagram,
  MapPin,
  Clock,
  ShieldCheck,
  Leaf,
  Heart,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, storeConfig } = useStore();

  return (
    <footer className="bg-[#153e1a] text-amber-50/90 pt-16 pb-12 border-t border-[#D4A017]/30 transition-colors relative overflow-hidden">
      {/* Background Decorative Graphic */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-[#D4A017]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-full bg-white p-1 border-2 border-[#D4A017] shadow-lg flex items-center justify-center shrink-0">
                <img
                  src="/LOGO.png"
                  alt="Sajjan Enne Gana Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white tracking-tight">
                  Sajjan Enne Gana
                </h3>
                <p className="text-[10px] text-[#D4A017] font-semibold uppercase tracking-[0.15em]">
                  TRADITIONAL WOODEN GHANI
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-emerald-100/70 font-sans">
              Crafting 100% natural, chemical-free cold pressed edible oils and organic protein-dense cattle feed flakes using age-old wooden Mara Chekku expellers.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://instagram.com/sajjan_yanne_gaana`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4A017] hover:text-zinc-950 flex items-center justify-center transition-all text-white shadow-sm"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/918217846338?text=Hello%20Sajjan%20Enne%20Gana,%20I%20want%20to%20order%20cold%20pressed%20oil`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all text-white shadow-sm"
                aria-label="WhatsApp Message"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={storeConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all text-white shadow-sm"
                aria-label="Google Maps Location"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#D4A017] mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#D4A017] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>• Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#D4A017] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>• Products Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#D4A017] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>• About Our Wooden Mill</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('track');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#D4A017] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>• Track Live Order</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#D4A017] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>• Contact & Mill Location</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact Details */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#D4A017] mb-4">
              Contact & Mill
            </h4>
            <ul className="space-y-3 text-xs text-emerald-100/80">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Call / Order Phone</p>
                  <a href="tel:+918217846338" className="hover:text-[#D4A017] transition-colors">
                    +91 82178 46338
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Instagram className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Instagram</p>
                  <a
                    href="https://instagram.com/sajjan_yanne_gaana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#D4A017] transition-colors"
                  >
                    @sajjan_yanne_gaana
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Operating Hours</p>
                  <p>Mon - Sat: 8:00 AM - 8:30 PM</p>
                  <p>Sunday: 9:00 AM - 2:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Google Maps Store Location Direct Box */}
          <div className="bg-emerald-950/70 border border-[#D4A017]/30 rounded-3xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white font-serif font-bold text-sm mb-1.5">
                <MapPin className="w-4 h-4 text-[#D4A017]" />
                <span>Visit Our Oil Mill</span>
              </div>
              <p className="text-[11px] text-emerald-200/80 leading-relaxed mb-3">
                Experience fresh cold pressing directly at our wooden ghani mill. Fresh batch tastings available every morning!
              </p>
            </div>

            <a
              href="https://maps.app.goo.gl/2ig1wVCd3C4mzt7TA?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#D4A017] hover:bg-[#c58f10] text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-center"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom Credits & Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/60">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Sajjan Enne Gana. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-200/80">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              100% Chemical-Free
            </span>
            <span className="flex items-center gap-1 text-amber-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
              FSSAI Standard Quality
            </span>
            <button
              onClick={() => {
                setCurrentView('owner_login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[11px] text-emerald-400/80 hover:text-white underline cursor-pointer"
            >
              Owner Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
