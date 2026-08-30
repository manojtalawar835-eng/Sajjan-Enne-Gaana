import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md ${
              t.type === 'success'
                ? 'bg-[#1B5E20]/95 border-[#D4A017]/40 text-white shadow-green-950/20'
                : t.type === 'error'
                ? 'bg-rose-900/95 border-rose-500/40 text-white shadow-rose-950/20'
                : 'bg-zinc-900/95 border-[#D4A017]/30 text-amber-50 shadow-black/20'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#D4A017]" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-amber-300" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-tight">{t.title}</h4>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed break-words">{t.message}</p>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="shrink-0 p-1 text-white/60 hover:text-white rounded-lg transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
