import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '918217846338';
  const defaultText = encodeURIComponent('Namaskara Sajjan Enne Gana! I would like to inquire about ordering 100% pure cold pressed oils and oil cakes.');

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${phoneNumber}?text=${defaultText}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat on WhatsApp with Sajjan Enne Gana"
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all relative border-2 border-white dark:border-zinc-900 group"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4A017] rounded-full border-2 border-white animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4A017] rounded-full border-2 border-white"></span>
      </a>

      {/* Tooltip bubble on desktop */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="hidden sm:flex items-center gap-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold py-2 px-3.5 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800"
          >
            <span>Chat on WhatsApp (+91 82178 46338)</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
