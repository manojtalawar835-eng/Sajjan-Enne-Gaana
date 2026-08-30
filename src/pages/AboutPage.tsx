import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  Leaf,
  Droplets,
  Heart,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  MapPin,
  Phone,
} from 'lucide-react';
import { motion } from 'motion/react';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero / Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-[#1B5E20]/10 text-[#1B5E20] dark:text-[#81C784] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#1B5E20]/20">
          Traditional Mara Chekku Heritage
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-900 dark:text-zinc-100">
          The Story of <span className="text-[#1B5E20] dark:text-[#81C784]">Sajjan Enne Gana</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
          Reviving timeless ancestral oil pressing traditions to deliver pure, unadulterated cold pressed edible oils directly from our wooden mill to your dining table.
        </p>
      </div>

      {/* Comparison Grid: Traditional Wooden Ghani vs Industrial Refined Oil */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-[#1B5E20]/10 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-center text-zinc-900 dark:text-zinc-100 mb-8">
          The Difference Between Pure Ghani Oil & Industrial Refined Oil
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Wooden Ghani (SEG) */}
          <div className="bg-[#FFF8E8]/70 dark:bg-emerald-950/20 p-6 rounded-3xl border-2 border-[#1B5E20] space-y-4">
            <div className="flex items-center gap-2 text-[#1B5E20] dark:text-[#81C784] font-serif font-bold text-lg">
              <Leaf className="w-6 h-6" />
              <h3>Sajjan Enne Gana (Traditional Wood Pressed)</h3>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                <span><strong>Zero Heat Extraction:</strong> Seeds are crushed slowly below 40°C in wooden pestles without boiling.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                <span><strong>No Chemical Solvents:</strong> Free from hexane, caustic soda, bleaching earth, and synthetic degumming acids.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                <span><strong>Nutrient-Dense:</strong> Retains 100% natural Vitamin E, polyphenol antioxidants, plant sterols, and authentic seed aroma.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                <span><strong>Pure Cattle Feed Byproduct:</strong> Remaining oil cakes are fresh, protein-rich feed for dairy cattle.</span>
              </li>
            </ul>
          </div>

          {/* Supermarket Refined Oils */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-6 rounded-3xl border border-zinc-300 dark:border-zinc-700 space-y-4 opacity-90">
            <div className="text-rose-700 dark:text-rose-400 font-serif font-bold text-lg">
              <h3>Commercial Industrial Refined Oils</h3>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Extreme Temperatures:</strong> Extracted at 200°C+ which breaks down healthy fatty acids into trans fats.
              </li>
              <li>
                <strong>Chemical Refining:</strong> Treated with petroleum solvents like Hexane to artificially maximize volume yield.
              </li>
              <li>
                <strong>Bleached & Deodorized:</strong> Natural fragrance and color are chemically stripped away, leaving dead liquid fats.
              </li>
              <li>
                <strong>Synthetic Preservatives:</strong> Added TBHQ chemicals to artificially extend supermarket shelf life.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-[#1B5E20]/10 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#1B5E20]/10 text-[#1B5E20] dark:text-[#81C784] flex items-center justify-center mx-auto">
            <Droplets className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">Direct From Seed</h3>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans">
            We procure only premium grade local sun-dried groundnuts, sunflower seeds, and Kusube safflower directly from honest Indian farmers.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-[#1B5E20]/10 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#D4A017]/20 text-[#D4A017] flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">Fresh Daily Batches</h3>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans">
            No old stock stored in warehouse drums. We extract every morning in small batches so you enjoy authentic home-cooked flavor.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-[#1B5E20]/10 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#1B5E20]/10 text-[#1B5E20] dark:text-[#81C784] flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">Family Wellness First</h3>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans">
            Our mission is bringing traditional nutritional purity back to every household kitchen, promoting heart health and longevity.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#206926] rounded-3xl p-8 sm:p-12 text-center text-white space-y-4 border border-[#D4A017]/40 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-50">
          Ready to taste true cold pressed purity?
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto font-sans leading-relaxed">
          Explore our Groundnut Oil, Sunflower Oil, Safflower Oil, and organic Cattle Feed Flakes.
        </p>
        <button
          onClick={() => {
            setCurrentView('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="py-3 px-8 bg-[#D4A017] hover:bg-[#c58f10] text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          Browse All Products
        </button>
      </div>
    </div>
  );
};
