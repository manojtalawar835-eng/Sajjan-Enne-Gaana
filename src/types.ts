export type UserRole = 'customer' | 'owner';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type ProductCategory = 'edible_oil' | 'oil_cake';

export interface SizePriceOption {
  size: string; // e.g., '1L', '2L', '5L' or '5kg', '10kg', '25kg', '50kg'
  price: number;
  originalPrice?: number;
}
export type SizeOption = SizePriceOption;

export interface Product {
  id: string;
  name: string;
  kannadaName?: string;
  image: string;
  category: ProductCategory;
  categoryLabel: string;
  sizeOptions: SizePriceOption[];
  defaultSize: string;
  stock: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  shortBenefit: string;
  nutritionalHighlights?: string[];
  extractionMethod?: string;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id = productId + size
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Accepted' | 'Preparing' | 'Packed' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export type PaymentMethod = 'Cash on Delivery' | 'UPI / PhonePe';

export interface OrderAddress {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentScreenshot?: string;
  transactionRef?: string;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  couponCode?: string;
  createdAt: string;
  estimatedDelivery: string;
}

export interface StoreConfig {
  shopName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  googleMapsUrl: string;
  address: string;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolder: string;
  minOrderForFreeDelivery: number;
  standardDeliveryFee: number;
  announcementText: string;
  isAnnouncementActive: boolean;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscount?: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  comment: string;
  productName: string;
  date: string;
  verifiedPurchase: boolean;
}
