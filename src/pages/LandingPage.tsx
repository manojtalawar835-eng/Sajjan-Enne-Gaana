import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Sparkles,
  ShieldCheck,
  Leaf,
  Droplets,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Star,
  Instagram,
  MapPin,
  ChevronRight,
  TrendingUp,
  Award,
  Clock,
  PhoneCall,
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const { products, reviews, setCurrentView, setAuthModalOpen, currentUser } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured || p.isAvailable);

  const benefits = [
    {
      icon: Droplets,
      title: '100% Cold Pressed',
      description: 'Slow-extracted below 40°C in traditional Mara Chekku wood mortars to preserve live micronutrients and vitamins.',
    },
    {
      icon: Leaf,
      title: 'Chemical Free',
      description: 'Zero hexane solvents, no chemical refining, no artificial colors or synthetic deodorizers. 100% unadulterated.',
    },
    {
      icon: ShieldCheck,
      title: 'Traditional Wooden Ghani',
      description: 'Authentic stone and wooden press technique ensuring high smoke points and retention of natural seeds aroma.',
    },
    {
      icon: Clock,
      title: 'Freshly Made Daily',
      description: 'Extracted in small morning batches directly at our mill to deliver peak freshness and unmatched culinary taste.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Banner with Natural Tones Styling */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF8E8] via-[#FBF5E5] to-[#FFF8E8] dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 pt-8 pb-16 sm:py-20 border-b border-[#1B5E20]/10">
        {/* Background ambient circular rings */}
        <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 w-[550px] h-[550px] bg-[#1B5E20]/5 rounded-full border border-[#1B5E20]/10 flex items-center justify-center p-12 pointer-events-none">
          <div className="w-full h-full bg-[#1B5E20] rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1.5 bg-[#D4A017]/20 text-[#D4A017] text-xs font-bold rounded-full uppercase tracking-[0.2em]"
              >
                Traditional Wooden Ghani
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.1] font-bold text-[#1B5E20] dark:text-[#81C784]"
              >
                Pure Nature, <br />
                <span className="italic text-[#D4A017]">Pressed For You.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
              >
                100% Cold pressed edible oils, extracted using traditional Mara Chekku wooden methods to preserve vital nutrients, live enzymes, and authentic rich aroma.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <button
                  onClick={() => {
                    setCurrentView('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#1B5E20] hover:bg-[#154a19] text-white px-8 py-3.5 rounded-full font-bold uppercase text-xs sm:text-sm tracking-widest shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 text-[#D4A017]" />
                </button>

                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="border-2 border-[#1B5E20] dark:border-[#81C784] text-[#1B5E20] dark:text-[#81C784] hover:bg-[#1B5E20]/5 px-8 py-3.5 rounded-full font-bold uppercase text-xs sm:text-sm tracking-widest transition-all cursor-pointer"
                >
                  <span>Learn More</span>
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E20] dark:text-[#81C784]" />
                  100% Wood Pressed
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E20] dark:text-[#81C784]" />
                  Zero Chemical Solvents
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E20] dark:text-[#81C784]" />
                  Direct Fresh Daily Batches
                </span>
              </div>
            </div>

            {/* Right Hero Product Feature Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#D4A017]/20 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Brand Stamp */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#FFF8E8] dark:bg-zinc-800 p-1 border border-[#D4A017] shadow-sm flex items-center justify-center">
                  <img src="/LOGO.png" alt="SEG Stamp" className="w-full h-full object-contain" />
                </div>

                <div className="w-full h-56 sm:h-64 bg-[#FFF8E8] dark:bg-zinc-950/60 rounded-2xl mb-4 flex items-center justify-center p-4">
                  <img
                    src="/GROUNDNUT.png"
                    alt="Sajjan Enne Gana Groundnut Oil"
                    className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="text-center pt-2">
                  <span className="inline-block px-2.5 py-0.5 bg-[#1B5E20]/10 text-[#1B5E20] dark:text-[#81C784] text-[10px] font-extrabold rounded-full uppercase tracking-wider mb-1">
                    Featured Heritage Oil
                  </span>
                  <p className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Wood Pressed Groundnut Oil
                  </p>
                  <p className="text-[#D4A017] font-bold text-lg mt-0.5">
                    ₹240 <span className="text-xs text-zinc-400 font-normal">/ 1L</span>
                  </p>
                  <button
                    onClick={() => {
                      setCurrentView('products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full mt-3 py-2.5 bg-[#1B5E20]/10 hover:bg-[#1B5E20] text-[#1B5E20] hover:text-white dark:text-[#81C784] dark:hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View Sizes (1L, 2L, 5L)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Key Benefits Section with Natural Tones Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017] inline-block px-3 py-1 bg-[#D4A017]/10 rounded-full">
            Why Choose Sajjan Enne Gana
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-zinc-900 dark:text-zinc-100 mt-3">
            Pure Nutrition, Zero Compromise
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            Every drop is extracted without boiling or toxic solvents to give your family authentic aroma and true wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-[#1B5E20]/10 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FFF8E8] dark:bg-zinc-800 text-[#1B5E20] dark:text-[#81C784] flex items-center justify-center mb-4 border border-[#D4A017]/20">
                  <Icon className="w-6 h-6 text-[#1B5E20] dark:text-[#D4A017]" />
                </div>
                <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017] inline-block px-3 py-1 bg-[#D4A017]/10 rounded-full mb-2">
              Fresh Daily Milling
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              Featured Products
            </h2>
          </div>

          <button
            onClick={() => {
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[#D4A017] text-sm font-bold uppercase tracking-wider border-b-2 border-[#D4A017] pb-0.5 hover:text-[#1B5E20] hover:border-[#1B5E20] transition-colors cursor-pointer self-start sm:self-auto"
          >
            View All Collection →
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Traditional Wooden Ghani Extraction Story */}
      <section className="bg-gradient-to-r from-[#1B5E20] via-[#206926] to-[#1B5E20] text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto shadow-2xl relative overflow-hidden border border-[#D4A017]/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A017]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          <div className="space-y-5">
            <span className="bg-[#D4A017] text-zinc-950 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
              Traditional Mara Chekku
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight text-amber-50">
              Why Refined Supermarket Oils Harm & Wood Pressed Oils Heal
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans">
              Industrial refined oils undergo extreme heat (over 200°C), caustic soda acid treatments, and petroleum solvents like hexane that destroy essential fatty acids and antioxidants.
            </p>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans">
              At <strong>Sajjan Enne Gana</strong>, we use slow-turning wooden pestles that crush clean seeds at ambient room temperatures. The extracted oil retains natural Vitamin E, squalene, rich color, and mouth-watering aroma.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
                <p className="text-2xl font-serif font-bold text-[#D4A017]">0%</p>
                <p className="text-xs text-emerald-100 font-medium">Trans Fats & Hexane</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
                <p className="text-2xl font-serif font-bold text-[#D4A017]">&lt; 40°C</p>
                <p className="text-xs text-emerald-100 font-medium">Low Temp Pressing</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 space-y-4">
            <h3 className="font-serif font-bold text-xl text-amber-200">Our Quality Promises:</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-emerald-50">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0 mt-0.5" />
                <span><strong>Single-Origin Indian Seeds:</strong> Only selected bold groundnuts, sun-dried sunflower seeds, and rich Kusube seeds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0 mt-0.5" />
                <span><strong>Natural Sedimentation:</strong> Unrefined oil is left to settle naturally in food-grade vessels before cloth filtration.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0 mt-0.5" />
                <span><strong>High-Yield Livestock Nutrition:</strong> Fresh oil cake flakes rich in natural protein for cattle and dairy farmers.</span>
              </li>
            </ul>

            <button
              onClick={() => {
                setCurrentView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 bg-[#D4A017] hover:bg-[#c58f10] text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-full shadow-md transition-all active:scale-95 text-center mt-3 cursor-pointer"
            >
              Read Our Heritage Story
            </button>
          </div>
        </div>
      </section>

      {/* 5. Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017] inline-block px-3 py-1 bg-[#D4A017]/10 rounded-full">
            Real Customer Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-100 mt-2">
            Loved by Thousands of Families & Dairy Farmers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-[#1B5E20]/10 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#D4A017] mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4A017]" />
                  ))}
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 italic leading-relaxed mb-4 font-serif">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {rev.customerName}
                    </h4>
                    <p className="text-[11px] text-zinc-500">{rev.location}</p>
                  </div>
                  {rev.verifiedPurchase && (
                    <span className="text-[10px] font-semibold text-[#1B5E20] dark:text-[#81C784] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#D4A017] font-medium mt-1 truncate">
                  Ordered: {rev.productName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Instagram Section (@sajjan_yanne_gaana) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF8E8] dark:bg-zinc-900/80 border border-[#1B5E20]/15 rounded-3xl p-6 sm:p-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white mb-3 shadow-md">
            <Instagram className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
            Follow Us on Instagram
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Watch live daily wooden ghani oil extraction videos & organic farming tips
          </p>

          <div className="mt-4 mb-6">
            <a
              href="https://instagram.com/sajjan_yanne_gaana"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-bold uppercase tracking-widest shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Instagram className="w-4 h-4 text-[#D4A017]" />
              <span>@sajjan_yanne_gaana</span>
            </a>
          </div>

          {/* Instagram Visual Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { img: '/GROUNDNUT.png', title: 'Groundnut Oil Extraction' },
              { img: '/SUNFLOWER.png', title: 'Fresh Sunflower Press' },
              { img: '/SAFFLOWER.png', title: 'Kardi Oil Bottling' },
              { img: '/COTTON_SEED_OIL_CAKE.png', title: 'Cotton Seed Flakes' },
              { img: '/GROUNDNUT_OIL_CAKE.png', title: 'Pure Shenga Pindi' },
              { img: '/SAFFLOWER_OIL_CAKE.png', title: 'Cattle Feed Bags' },
            ].map((post, idx) => (
              <a
                key={idx}
                href="https://instagram.com/sajjan_yanne_gaana"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-zinc-800 border border-[#1B5E20]/10 shadow-xs p-2 flex items-center justify-center hover:scale-103 transition-transform"
              >
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-contain group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Instagram className="w-5 h-5 text-[#D4A017]" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Direct Mill Location & Order Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-r from-amber-500 via-[#D4A017] to-amber-600 rounded-3xl p-6 sm:p-10 text-zinc-950 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-3xl font-bold font-serif">
              Need Bulk Oil or Direct Mill Pickups?
            </h3>
            <p className="text-xs sm:text-sm font-medium text-zinc-900 max-w-xl">
              We supply pure wooden ghani oils for households, restaurants, caterers, and 50kg oil cake bags for dairy farms.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+918217846338"
              className="py-3 px-6 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-[#D4A017]" />
              <span>Call +91 82178 46338</span>
            </a>
            <a
              href="https://maps.app.goo.gl/2ig1wVCd3C4mzt7TA?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
