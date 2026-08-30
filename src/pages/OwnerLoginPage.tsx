import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Lock,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  Store,
  Sparkles,
} from 'lucide-react';

export const OwnerLoginPage: React.FC = () => {
  const { loginOwner, setCurrentView, showToast } = useStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('sajjan2025');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginOwner(username, password);
    if (!success) {
      setErrorMsg('Invalid Owner credentials. Use admin / sajjan2025');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <button
        onClick={() => setCurrentView('landing')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5E20] dark:text-[#81C784] mb-6 hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Storefront
      </button>

      <div className="bg-white dark:bg-zinc-900 border-2 border-[#D4A017] rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#1B5E20] text-[#D4A017] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold font-['Poppins'] text-zinc-900 dark:text-zinc-100">
            Owner Portal Login
          </h1>
          <p className="text-xs text-zinc-500">
            Sajjan Enne Gana Business Administration & Real-Time Price Manager
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300 mb-1">
              Owner Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300 mb-1">
              Admin Password / PIN
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Access Owner Portal
          </button>
        </form>

        <div className="p-3 bg-[#FFF8E8] dark:bg-zinc-800/80 rounded-xl border border-[#D4A017]/30 text-[11px] text-zinc-700 dark:text-zinc-300">
          <p className="font-bold text-[#1B5E20] dark:text-[#D4A017] mb-1">
            Demo Credentials Pre-filled:
          </p>
          <p>Username: <code className="font-bold">admin</code></p>
          <p>Password: <code className="font-bold">sajjan2025</code></p>
        </div>
      </div>
    </div>
  );
};
