import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  User,
  StoreConfig,
  Coupon,
  CustomerReview,
  OrderStatus,
  PaymentMethod,
  OrderAddress,
  SizePriceOption,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_STORE_CONFIG,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
} from '../data/initialData';

export type AppView =
  | 'landing'
  | 'products'
  | 'product_detail'
  | 'cart'
  | 'checkout'
  | 'confirmation'
  | 'track'
  | 'contact'
  | 'about'
  | 'wishlist'
  | 'orders'
  | 'owner_portal'
  | 'owner_login';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface StoreContextType {
  // Navigation & Views
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  navigateToProduct: (id: string) => void;
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;
  lastConfirmedOrder: Order | null;
  setLastConfirmedOrder: (order: Order | null) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Auth
  currentUser: User | null;
  isOwnerLoggedIn: boolean;
  loginAsCustomer: (identifier: string, name?: string) => void;
  loginAsOwner: (password: string, email?: string) => boolean;
  logoutCustomer: () => void;
  logoutOwner: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authRedirectView: AppView | null;
  setAuthRedirectView: (view: AppView | null) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  updateProductPrice: (id: string, size: string, newPrice: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  deliveryCharge: number;
  cartTotal: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[]; // product ids
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Recently Viewed
  recentlyViewedIds: string[];
  markAsRecentlyViewed: (productId: string) => void;

  // Orders
  orders: Order[];
  createOrder: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: OrderAddress;
    paymentMethod: PaymentMethod;
    paymentScreenshot?: string;
    transactionRef?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersForCustomer: (phoneOrEmail: string) => Order[];

  // Store Configuration & Coupons
  storeConfig: StoreConfig;
  updateStoreConfig: (newConfig: Partial<StoreConfig>) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (code: string) => void;
  deleteCoupon: (code: string) => void;

  // Reviews
  reviews: CustomerReview[];
  addReview: (review: Omit<CustomerReview, 'id' | 'date' | 'verifiedPurchase'>) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // OTP Demo helper
  lastSentOtp: { target: string; code: string; timestamp: number } | null;
  generateAndSendOtp: (target: string) => string;
  verifyOtp: (target: string, code: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Navigation State
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('SEG-8921');
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);

  // 2. Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('seg_theme') === 'dark';
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('seg_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // 3. Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('seg_customer_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('seg_owner_session') === 'true';
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authRedirectView, setAuthRedirectView] = useState<AppView | null>(null);

  // 4. Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('seg_products_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('seg_products_v2', JSON.stringify(products));
  }, [products]);

  // 5. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('seg_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('seg_cart', JSON.stringify(cart));
  }, [cart]);

  // 6. Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('seg_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('seg_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // 7. Recently Viewed
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('seg_recently_viewed');
    return saved ? JSON.parse(saved) : ['prod-groundnut-oil', 'prod-safflower-oil'];
  });

  useEffect(() => {
    localStorage.setItem('seg_recently_viewed', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  // 8. Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('seg_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('seg_orders', JSON.stringify(orders));
  }, [orders]);

  // 9. Store Config State
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('seg_config');
    return saved ? JSON.parse(saved) : INITIAL_STORE_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('seg_config', JSON.stringify(storeConfig));
  }, [storeConfig]);

  // 10. Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('seg_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  useEffect(() => {
    localStorage.setItem('seg_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // 11. Applied Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // 12. Reviews State
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem('seg_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // 13. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 14. OTP System
  const [lastSentOtp, setLastSentOtp] = useState<{ target: string; code: string; timestamp: number } | null>(null);

  const generateAndSendOtp = (target: string): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setLastSentOtp({ target, code, timestamp: Date.now() });
    showToast(
      'OTP Sent Successfully',
      `Verification code ${code} sent to ${target}`,
      'info'
    );
    return code;
  };

  const verifyOtp = (target: string, code: string): boolean => {
    if (!lastSentOtp) return false;
    const isTargetMatch = lastSentOtp.target.trim().toLowerCase() === target.trim().toLowerCase();
    const isCodeMatch = lastSentOtp.code === code.trim();
    // Also allow master test OTP 123456
    if (code.trim() === '123456' || (isTargetMatch && isCodeMatch)) {
      return true;
    }
    return false;
  };

  // Auth Methods
  const loginAsCustomer = (identifier: string, name?: string) => {
    const isEmail = identifier.includes('@');
    const newUser: User = {
      id: 'cust-' + Date.now(),
      name: name || (isEmail ? identifier.split('@')[0] : 'Valued Customer'),
      phone: isEmail ? '+91 98765 43210' : identifier,
      email: isEmail ? identifier : `${identifier.replace(/\D/g, '')}@customer.sajjan.in`,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    localStorage.setItem('seg_customer_user', JSON.stringify(newUser));
    setAuthModalOpen(false);
    showToast('Welcome back!', `Logged in as ${newUser.name}`, 'success');

    // Requirement: Product Dashboard must open first after customer login!
    if (authRedirectView) {
      setCurrentView(authRedirectView);
      setAuthRedirectView(null);
    } else {
      setCurrentView('products');
    }
  };

  const loginAsOwner = (password: string, email?: string): boolean => {
    // Owner password check
    if (password === 'sajjan123' || password === 'admin123' || password === '123456') {
      setIsOwnerLoggedIn(true);
      localStorage.setItem('seg_owner_session', 'true');
      showToast('Owner Verified', 'Welcome to Sajjan Enne Gana Admin Portal', 'success');
      setCurrentView('owner_portal');
      return true;
    }
    showToast('Authentication Failed', 'Invalid Owner Password or Credentials', 'error');
    return false;
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    localStorage.removeItem('seg_customer_user');
    showToast('Logged Out', 'You have been signed out safely', 'info');
    setCurrentView('landing');
  };

  const logoutOwner = () => {
    setIsOwnerLoggedIn(false);
    localStorage.removeItem('seg_owner_session');
    showToast('Owner Signed Out', 'Admin session closed', 'info');
    setCurrentView('landing');
  };

  // Product Methods
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('Product Added', `${newProduct.name} added to catalog`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product Updated', 'Changes saved successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product Removed', 'Product has been deleted from store', 'info');
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isAvailable;
          showToast(
            nextState ? 'In Stock' : 'Out of Stock',
            `${p.name} is now ${nextState ? 'available' : 'marked out of stock'}`,
            'info'
          );
          return { ...p, isAvailable: nextState };
        }
        return p;
      })
    );
  };

  const updateProductPrice = (id: string, size: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedSizes = p.sizeOptions.map((opt) =>
            opt.size === size ? { ...opt, price: newPrice } : opt
          );
          return { ...p, sizeOptions: updatedSizes };
        }
        return p;
      })
    );
    showToast('Price Updated', `Price for ${size} updated to ₹${newPrice}`, 'success');
  };

  // Cart Methods
  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    const sizeOpt = product.sizeOptions.find((s) => s.size === size) || product.sizeOptions[0];
    const unitPrice = sizeOpt ? sizeOpt.price : 200;
    const cartItemId = `${product.id}_${size}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          size: size,
          price: unitPrice,
          quantity: quantity,
          maxStock: product.stock,
        };
        return [...prev, newItem];
      }
    });

    showToast(
      'Added to Cart',
      `${quantity}x ${product.name} (${size}) added to your basket`,
      'success'
    );
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item Removed', 'Product removed from shopping cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    const calculated = (cartSubtotal * appliedCoupon.discountPercentage) / 100;
    discountAmount = appliedCoupon.maxDiscount
      ? Math.min(calculated, appliedCoupon.maxDiscount)
      : calculated;
  }

  const deliveryCharge =
    cartSubtotal === 0 || cartSubtotal >= storeConfig.minOrderForFreeDelivery
      ? 0
      : storeConfig.standardDeliveryFee;

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + deliveryCharge);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum cart value of ₹${found.minOrderValue}`,
      };
    }
    setAppliedCoupon(found);
    showToast('Coupon Applied!', `${found.code} saved you ₹${Math.round((cartSubtotal * found.discountPercentage) / 100)}`, 'success');
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Coupon discount cleared', 'info');
  };

  // Wishlist Methods
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'Item removed from favorites', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist', 'Item added to your favorite list', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Recently Viewed
  const markAsRecentlyViewed = (productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 6);
    });
  };

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    markAsRecentlyViewed(id);
    setCurrentView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Orders Methods
  const createOrder = (data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: OrderAddress;
    paymentMethod: PaymentMethod;
    paymentScreenshot?: string;
    transactionRef?: string;
  }): Order => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SEG-${orderNumber}`;

    const orderItems = cart.map((c) => ({
      productId: c.productId,
      productName: c.productName,
      productImage: c.productImage,
      size: c.size,
      price: c.price,
      quantity: c.quantity,
      totalPrice: c.price * c.quantity,
    }));

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const matchingCartItems = cart.filter((c) => c.productId === p.id);
        if (matchingCartItems.length > 0) {
          const totalQty = matchingCartItems.reduce((sum, item) => sum + item.quantity, 0);
          return { ...p, stock: Math.max(0, p.stock - totalQty) };
        }
        return p;
      })
    );

    // Calculate delivery date (2-3 business days)
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);
    const estimatedDelivery = estDate.toISOString().split('T')[0];

    const newOrder: Order = {
      id: orderId,
      userId: currentUser?.id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      address: data.address,
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryCharge,
      discount: discountAmount,
      total: cartTotal,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'UPI / PhonePe' ? 'Paid' : 'Pending',
      paymentScreenshot: data.paymentScreenshot,
      transactionRef: data.transactionRef,
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: `Order registered via ${data.paymentMethod}`,
        },
      ],
      couponCode: appliedCoupon?.code,
      createdAt: new Date().toISOString(),
      estimatedDelivery,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastConfirmedOrder(newOrder);
    setTrackingOrderId(orderId);
    clearCart();
    setAppliedCoupon(null);

    showToast('Order Placed Successfully!', `Order #${orderId} has been confirmed.`, 'success');
    setCurrentView('confirmation');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedHistory = [
            ...o.statusHistory,
            { status, timestamp: new Date().toISOString(), note: note || `Status updated to ${status}` },
          ];
          const isDelivered = status === 'Delivered';
          return {
            ...o,
            status,
            paymentStatus: isDelivered ? 'Paid' : o.paymentStatus,
            statusHistory: updatedHistory,
          };
        }
        return o;
      })
    );
    showToast('Order Status Updated', `Order #${orderId} set to "${status}"`, 'info');
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id.toLowerCase() === orderId.trim().toLowerCase());
  };

  const getOrdersForCustomer = (phoneOrEmail: string) => {
    const query = phoneOrEmail.trim().toLowerCase();
    return orders.filter(
      (o) =>
        o.customerPhone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(query))
    );
  };

  // Store config update
  const updateStoreConfig = (newConfig: Partial<StoreConfig>) => {
    setStoreConfig((prev) => ({ ...prev, ...newConfig }));
    showToast('Settings Saved', 'Store configuration updated successfully', 'success');
  };

  // Coupons management
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showToast('Coupon Created', `Discount code ${coupon.code} is now active`, 'success');
  };

  const toggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast('Coupon Deleted', 'Discount code removed', 'info');
  };

  // Reviews
  const addReview = (reviewData: Omit<CustomerReview, 'id' | 'date' | 'verifiedPurchase'>) => {
    const newRev: CustomerReview = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank You!', 'Your review has been published', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        navigateToProduct,
        trackingOrderId,
        setTrackingOrderId,
        lastConfirmedOrder,
        setLastConfirmedOrder,
        isDarkMode,
        toggleDarkMode,
        currentUser,
        isOwnerLoggedIn,
        loginAsCustomer,
        loginAsOwner,
        logoutCustomer,
        logoutOwner,
        authModalOpen,
        setAuthModalOpen,
        authRedirectView,
        setAuthRedirectView,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        updateProductPrice,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        discountAmount,
        deliveryCharge,
        cartTotal,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        recentlyViewedIds,
        markAsRecentlyViewed,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrdersForCustomer,
        storeConfig,
        updateStoreConfig,
        coupons,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        reviews,
        addReview,
        toasts,
        showToast,
        dismissToast,
        lastSentOtp,
        generateAndSendOtp,
        verifyOtp,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
