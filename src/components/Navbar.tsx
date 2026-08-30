import React, { useState } from 'react';
import { useStore, AppView } from '../context/StoreContext';
import {
  ShoppingBag,
  Heart,
  User,
  ShieldCheck,
  Search,
  Menu,
  X,
  Compass,
  PhoneCall,
  Info,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Truck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    currentUser,
    isOwnerLoggedIn,
    logoutCustomer,
    logoutOwner,
    setAuthModalOpen,
    isDarkMode,
    toggleDarkMode,
    storeConfig,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks: { label: string; view: AppView; icon: any }[] = [
    { label: 'Home', view: 'landing', icon: Sparkles },
    { label: 'Products', view: 'products', icon: ShoppingBag },
    { label: 'About Us', view: 'about', icon: Info },
    { label: 'Track Order', view: 'track', icon: Truck },
    { label: 'Contact', view: 'contact', icon: PhoneCall },
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {storeConfig.isAnnouncementActive && (
        <div className="bg-[#1B5E20] text-[#FFF8E8] text-xs font-medium py-1.5 px-4 text-center border-b border-[#D4A017]/30 flex items-center justify-center gap-2 tracking-wide">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D4A017] animate-pulse"></span>
          <span>{storeConfig.announcementText}</span>
        </div>
      )}

      {/* Main Sticky Navbar with Natural Tones Glassmorphism */}
      <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-zinc-950/80 backdrop-blur-md border-b border-[#1B5E20]/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Brand Logo & Name */}
            <div
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#1B5E20] border-2 border-[#D4A017] p-1 shadow-md group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center">
                <img
                  src="/LOGO.png"
                  alt="Sajjan Enne Gana Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg sm:text-xl text-[#1B5E20] dark:text-[#81C784] tracking-tight leading-none group-hover:text-[#D4A017] transition-colors">
                  Sajjan Enne Gana
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-[#D4A017] dark:text-amber-400 mt-1 tracking-[0.15em] uppercase">
                  100% Cold Pressed • Wood Ghani
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-3">
              {navLinks.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.view)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#1B5E20] text-white shadow-sm'
                        : 'text-zinc-700 dark:text-zinc-300 hover:text-[#D4A017] hover:bg-[#1B5E20]/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Wishlist Button */}
              <button
                onClick={() => handleNavClick('wishlist')}
                aria-label="Wishlist"
                className="relative p-2.5 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-[#1B5E20]/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={() => handleNavClick('cart')}
                aria-label="Shopping Cart"
                className="relative p-2.5 rounded-full bg-[#1B5E20]/10 dark:bg-[#1B5E20]/30 text-[#1B5E20] dark:text-[#81C784] hover:bg-[#1B5E20] hover:text-white dark:hover:bg-[#1B5E20] dark:hover:text-white transition-all cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-extrabold text-zinc-950 bg-[#D4A017] rounded-full shadow border border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* Auth / Account Profile */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 py-2 px-5 rounded-full bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline truncate max-w-[100px]">{currentUser.name}</span>
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-[#1B5E20]/10 dark:border-zinc-800 p-2 z-50 text-zinc-800 dark:text-zinc-200 text-sm"
                      >
                        <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                          <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{currentUser.name}</p>
                          <p className="text-[11px] text-zinc-500 truncate">{currentUser.phone || currentUser.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleNavClick('products');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-2"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#1B5E20]" />
                          Product Catalog
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleNavClick('orders');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-2"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#1B5E20]" />
                          My Orders & History
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleNavClick('wishlist');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-2"
                        >
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          My Wishlist ({wishlist.length})
                        </button>
                        <div className="border-t border-zinc-100 dark:border-zinc-800 my-1"></div>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logoutCustomer();
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 text-xs font-semibold flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="py-2 px-6 rounded-full bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs sm:text-sm font-bold uppercase tracking-widest shadow-sm hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>Login</span>
                </button>
              )}

              {/* Owner Portal Link */}
              <button
                onClick={() => handleNavClick(isOwnerLoggedIn ? 'owner_portal' : 'owner_login')}
                title="Owner Admin Portal"
                className={`py-1.5 px-3.5 rounded-full border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  currentView === 'owner_portal' || currentView === 'owner_login'
                    ? 'bg-[#D4A017] text-zinc-950 border-[#D4A017]'
                    : 'border-[#D4A017]/60 text-[#1B5E20] dark:text-[#D4A017] hover:bg-[#D4A017]/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden lg:inline">Owner</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[#D4A017]/20 bg-[#FFF8E8] dark:bg-zinc-950 px-4 py-4 space-y-2 overflow-hidden shadow-lg"
            >
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.view)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-[#1B5E20] text-white shadow-sm'
                        : 'text-zinc-800 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-2 border-t border-[#D4A017]/20 flex flex-col gap-2">
                <button
                  onClick={() => handleNavClick(isOwnerLoggedIn ? 'owner_portal' : 'owner_login')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-100/60 dark:bg-amber-950/30 text-[#1B5E20] dark:text-[#D4A017] text-sm font-bold"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Owner Admin Portal
                  </span>
                  <span className="text-xs bg-[#1B5E20] text-white px-2 py-0.5 rounded-full">
                    {isOwnerLoggedIn ? 'Active' : 'Login'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
