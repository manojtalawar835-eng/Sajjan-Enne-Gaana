import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ToastContainer } from './components/ToastContainer';
import { CustomerAuthModal } from './components/CustomerAuthModal';

import { LandingPage } from './pages/LandingPage';
import { ProductDashboard } from './pages/ProductDashboard';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { OwnerLoginPage } from './pages/OwnerLoginPage';
import { OwnerPortalPage } from './pages/OwnerPortalPage';

import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const { currentView, isOwnerLoggedIn } = useStore();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage key="landing" />;
      case 'products':
        return <ProductDashboard key="products" />;
      case 'product_detail':
        return <ProductDetailPage key="product_detail" />;
      case 'cart':
        return <CartPage key="cart" />;
      case 'checkout':
        return <CheckoutPage key="checkout" />;
      case 'order_confirmation':
        return <OrderConfirmationPage key="order_confirmation" />;
      case 'track':
        return <OrderTrackingPage key="track" />;
      case 'about':
        return <AboutPage key="about" />;
      case 'contact':
        return <ContactPage key="contact" />;
      case 'owner_login':
        return isOwnerLoggedIn ? (
          <OwnerPortalPage key="owner_portal" />
        ) : (
          <OwnerLoginPage key="owner_login" />
        );
      case 'owner_portal':
        return isOwnerLoggedIn ? (
          <OwnerPortalPage key="owner_portal" />
        ) : (
          <OwnerLoginPage key="owner_login" />
        );
      default:
        return <LandingPage key="landing" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E8] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#D4A017] selection:text-zinc-950 font-sans transition-colors duration-200">
      {/* Global Navbar */}
      <Navbar />

      {/* Main View with subtle entry transition */}
      <main className="flex-1 w-full pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Connect Button */}
      <FloatingWhatsApp />

      {/* Global Customer Auth Modal */}
      <CustomerAuthModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
