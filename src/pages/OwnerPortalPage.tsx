import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus, PaymentStatus, SizeOption } from '../types';
import * as XLSX from 'xlsx';
import {
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Download,
  Check,
  AlertTriangle,
  Clock,
  Truck,
  ShieldCheck,
  QrCode,
  Tag,
  Save,
  LogOut,
  ChevronRight,
  Search,
} from 'lucide-react';
import { motion } from 'motion/react';

export const OwnerPortalPage: React.FC = () => {
  const {
    products,
    updateProductPrice,
    updateProductStock,
    toggleProductAvailability,
    addProduct,
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    storeConfig,
    updateStoreConfig,
    coupons,
    addCoupon,
    toggleCoupon,
    logoutOwner,
    showToast,
    setCurrentView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings' | 'coupons'>('overview');

  // Order filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Product price editing inline
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editedSizeOptions, setEditedSizeOptions] = useState<SizeOption[]>([]);
  const [editedStock, setEditedStock] = useState<number>(0);

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newKannadaName, setNewKannadaName] = useState('');
  const [newCategory, setNewCategory] = useState<'edible_oil' | 'oil_cake'>('edible_oil');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('/GROUNDNUT.png');
  const [newSizes, setNewSizes] = useState<{ size: string; price: number; originalPrice?: number }[]>([
    { size: '1L', price: 240, originalPrice: 280 },
    { size: '2L', price: 470, originalPrice: 540 },
    { size: '5L', price: 1150, originalPrice: 1300 },
  ]);

  // Store config edit state
  const [configForm, setConfigForm] = useState(storeConfig);

  // New coupon state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(10);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<number>(500);

  // Analytics Metrics Calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const allOrdersRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // Start editing product prices
  const handleStartEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditedSizeOptions(JSON.parse(JSON.stringify(prod.sizeOptions)));
    setEditedStock(prod.stock);
  };

  const handleSaveProductEdit = (productId: string) => {
    updateProductPrice(productId, editedSizeOptions);
    updateProductStock(productId, editedStock);
    setEditingProductId(null);
  };

  const handleUpdateVariantPrice = (idx: number, newPrice: number) => {
    const updated = [...editedSizeOptions];
    updated[idx].price = newPrice;
    setEditedSizeOptions(updated);
  };

  // Add Product Handler
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      name: newProductName.trim(),
      kannadaName: newKannadaName.trim() || undefined,
      category: newCategory,
      categoryLabel: newCategory === 'edible_oil' ? 'Cold Pressed Oil' : 'Cattle Feed',
      defaultSize: newSizes[0]?.size || '1L',
      sizeOptions: newSizes,
      image: newImage,
      description: newDescription.trim() || 'Traditional Mara Chekku extracted oil.',
      shortBenefit: '100% Pure & Unrefined',
      nutritionalHighlights: ['Zero Trans Fats', 'Rich in Micronutrients'],
      rating: 5.0,
      reviewCount: 1,
      stock: 50,
      isAvailable: true,
      isFeatured: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addProduct(newProd);
    setShowAddProductModal(false);
    setNewProductName('');
    setNewKannadaName('');
  };

  // Export orders to Excel
  const handleExportOrdersToExcel = () => {
    try {
      const dataToExport = orders.map((o) => ({
        OrderID: o.id,
        Date: o.createdAt,
        Customer: o.customerName,
        Phone: o.customerPhone,
        Address: `${o.address.streetAddress}, ${o.address.city}, ${o.address.pincode}`,
        ItemsCount: o.items.length,
        ItemsList: o.items.map((i) => `${i.productName} (${i.size} x ${i.quantity})`).join('; '),
        TotalAmount: o.total,
        PaymentMethod: o.paymentMethod,
        PaymentStatus: o.paymentStatus,
        OrderStatus: o.status,
        TransactionRef: o.transactionRef || 'N/A',
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sajjan_Orders');
      XLSX.writeFile(workbook, `SajjanEnneGana_Orders_${Date.now()}.xlsx`);
      showToast('Exported Orders', 'Excel sheet generated successfully', 'success');
    } catch (e) {
      console.error(e);
      showToast('Export Failed', 'Could not export Excel file', 'error');
    }
  };

  // Save store settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig(configForm);
  };

  // Add coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: Number(newCouponDiscount),
      minOrderValue: Number(newCouponMinOrder),
      description: `${newCouponDiscount}% Discount on orders above ₹${newCouponMinOrder}`,
      isActive: true,
    });
    setNewCouponCode('');
  };

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' ? true : o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-[#D4A017]/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#1B5E20] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Administration
            </span>
            <span className="text-xs font-semibold text-[#D4A017]">Owner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Poppins'] text-zinc-900 dark:text-zinc-100 mt-1">
            Sajjan Enne Gana Business Hub
          </h1>
          <p className="text-xs text-zinc-500">
            Real-time price modification, stock counts, order fulfillment, and UPI bank management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            View Live Store
          </button>
          <button
            onClick={logoutOwner}
            className="py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-100 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
          { id: 'products', label: `Products & Prices (${products.length})`, icon: Package },
          { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'settings', label: 'Store & UPI Config', icon: Settings },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1B5E20] text-white shadow-md'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
              }`}
            >
              <Icon className="w-4 h-4 text-[#D4A017]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-[#D4A017]/30 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span>Total Revenue (Paid)</span>
                <DollarSign className="w-4 h-4 text-[#1B5E20]" />
              </div>
              <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-['Poppins']">
                ₹{totalRevenue.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                Total Orders Value: ₹{allOrdersRevenue.toLocaleString()}
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-[#D4A017]" />
              </div>
              <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-['Poppins']">
                {orders.length}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                {deliveredOrders} delivered • {pendingOrders} pending
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span>Active Products</span>
                <Package className="w-4 h-4 text-[#1B5E20]" />
              </div>
              <p className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-['Poppins']">
                {products.length}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                {products.filter((p) => p.isAvailable).length} listed online
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span>Stock Alerts</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-amber-600 font-['Poppins']">
                {lowStockProducts.length} Items Low
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                {lowStockProducts.length === 0 ? 'All stocks healthy' : 'Restock fresh batches soon'}
              </p>
            </div>
          </div>

          {/* Quick Actions & Recent Orders Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 font-['Poppins']">
                  Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#1B5E20] dark:text-[#81C784] hover:underline"
                >
                  View All Orders
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                      <th className="pb-3 font-semibold">Order</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Total</th>
                      <th className="pb-3 font-semibold">Payment</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">#{o.id}</td>
                        <td className="py-3 font-medium text-zinc-800 dark:text-zinc-200">{o.customerName}</td>
                        <td className="py-3 font-bold text-[#1B5E20] dark:text-[#81C784]">₹{o.total}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.paymentStatus === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-[10px]">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Price Check Box */}
            <div className="lg:col-span-4 bg-[#FFF8E8] dark:bg-zinc-900/90 border border-[#D4A017]/40 p-6 rounded-3xl shadow-xs space-y-4">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 font-['Poppins'] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#D4A017]" />
                <span>Instant Oil Rates</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Customer storefront updates dynamically whenever you change these prices in the Products tab.
              </p>

              <div className="space-y-3 text-xs">
                {products.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{p.name}</p>
                      <p className="text-[10px] text-zinc-500">{p.sizeOptions.map((s) => `${s.size}: ₹${s.price}`).join(' | ')}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('products');
                        handleStartEditProduct(p);
                      }}
                      className="p-1.5 text-zinc-500 hover:text-[#1B5E20]"
                      title="Edit price"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('products')}
                className="w-full py-2.5 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Manage All Product Prices
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & PRICE MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-['Poppins'] text-zinc-900 dark:text-zinc-100">
                Product Catalog & Real-Time Price Manager
              </h2>
              <p className="text-xs text-zinc-500">
                Update packaging sizes, prices per liter/kg, stock counts, and store listing status.
              </p>
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="py-2.5 px-4 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4A017]" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Products List & In-place price editor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((prod) => {
              const isEditing = editingProductId === prod.id;

              return (
                <div
                  key={prod.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-24 bg-[#FEFBF3] dark:bg-zinc-950 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800 shrink-0 flex items-center justify-center">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-h-full object-contain drop-shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/LOGO.png';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#1B5E20] dark:text-[#81C784] uppercase">
                            {prod.categoryLabel}
                          </span>
                          <button
                            onClick={() => toggleProductAvailability(prod.id)}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full cursor-pointer ${
                              prod.isAvailable
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {prod.isAvailable ? 'Online (Visible)' : 'Hidden'}
                          </button>
                        </div>

                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {prod.name}
                        </h3>
                        {prod.kannadaName && (
                          <p className="text-xs text-zinc-500">{prod.kannadaName}</p>
                        )}
                        <p className="text-xs text-zinc-400 mt-1">Stock: {prod.stock} units</p>
                      </div>
                    </div>

                    {/* Size & Prices Display / Editor */}
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                      <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                        Available Sizes & Prices:
                      </p>

                      {isEditing ? (
                        <div className="space-y-2">
                          {editedSizeOptions.map((opt, idx) => (
                            <div key={opt.size} className="flex items-center gap-2 text-xs">
                              <span className="w-14 font-bold text-zinc-800 dark:text-zinc-200">{opt.size}:</span>
                              <span className="text-zinc-400">₹</span>
                              <input
                                type="number"
                                value={opt.price}
                                onChange={(e) => handleUpdateVariantPrice(idx, Number(e.target.value))}
                                className="w-24 px-2 py-1 bg-white dark:bg-zinc-900 border rounded-lg font-bold text-xs"
                              />
                            </div>
                          ))}

                          <div className="flex items-center gap-2 pt-2 border-t text-xs">
                            <span className="w-20 font-bold">Stock Count:</span>
                            <input
                              type="number"
                              value={editedStock}
                              onChange={(e) => setEditedStock(Number(e.target.value))}
                              className="w-24 px-2 py-1 bg-white dark:bg-zinc-900 border rounded-lg font-bold text-xs"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {prod.sizeOptions.map((opt) => (
                            <div
                              key={opt.size}
                              className="p-1.5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 text-center"
                            >
                              <span className="text-[10px] text-zinc-400 block">{opt.size}</span>
                              <span className="font-extrabold text-[#1B5E20] dark:text-[#81C784]">
                                ₹{opt.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setEditingProductId(null)}
                          className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveProductEdit(prod.id)}
                          className="px-4 py-1.5 bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStartEditProduct(prod)}
                        className="py-1.5 px-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-[#1B5E20] text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#D4A017]" />
                        <span>Edit Prices & Stock</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-['Poppins'] text-zinc-900 dark:text-zinc-100">
                Customer Orders & Fulfillment
              </h2>
              <p className="text-xs text-zinc-500">
                Update shipment statuses, verify UPI payment receipts, and download full logs.
              </p>
            </div>

            <button
              onClick={handleExportOrdersToExcel}
              className="py-2.5 px-4 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#D4A017]" />
              <span>Export Orders to Excel</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search Order ID, name, phone..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-zinc-500 font-semibold">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Packed">Packed</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Cards / Table */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-extrabold text-[#1B5E20] dark:text-[#81C784]">
                        #{order.id}
                      </span>
                      <span className="text-xs text-zinc-500">{order.createdAt}</span>
                    </div>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                      {order.customerName} ({order.customerPhone})
                    </p>
                  </div>

                  {/* Status update selectors */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Fulfillment Status</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="px-3 py-1.5 rounded-xl border font-bold text-xs bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Payment</span>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                        className="px-3 py-1.5 rounded-xl border font-bold text-xs bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Items & Address details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                  <div>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">Delivery Address:</p>
                    <p>{order.address.streetAddress}</p>
                    <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                  </div>

                  <div>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">Ordered Items:</p>
                    {order.items.map((it, i) => (
                      <p key={i}>
                        {it.quantity}x {it.productName} ({it.size}) - ₹{it.totalPrice}
                      </p>
                    ))}
                    <p className="font-extrabold text-sm text-[#1B5E20] dark:text-[#81C784] pt-1">
                      Total: ₹{order.total} ({order.paymentMethod})
                    </p>
                  </div>

                  {/* Payment Proof / Transaction Ref */}
                  <div>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 mb-1">Payment Verification:</p>
                    <p>Method: {order.paymentMethod}</p>
                    {order.transactionRef && (
                      <p className="font-mono text-zinc-800 dark:text-zinc-200">UTR: {order.transactionRef}</p>
                    )}
                    {order.paymentScreenshot && (
                      <div className="mt-1">
                        <a
                          href={order.paymentScreenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1B5E20] dark:text-[#D4A017] underline font-bold"
                        >
                          View Uploaded Screenshot ↗
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STORE & UPI CONFIG */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-xl font-bold font-['Poppins'] text-zinc-900 dark:text-zinc-100">
              Store & UPI Payment Configuration
            </h2>
            <p className="text-xs text-zinc-500">
              Update the UPI ID and bank details used to generate instant customer QR codes.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  required
                  value={configForm.shopName}
                  onChange={(e) => setConfigForm({ ...configForm, shopName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Owner UPI ID (for dynamic QR)
                </label>
                <input
                  type="text"
                  required
                  value={configForm.upiId}
                  onChange={(e) => setConfigForm({ ...configForm, upiId: e.target.value })}
                  placeholder="e.g. 8217846338@ybl"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Contact & WhatsApp Phone
                </label>
                <input
                  type="text"
                  required
                  value={configForm.contactPhone}
                  onChange={(e) => setConfigForm({ ...configForm, contactPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Free Delivery Minimum Order (₹)
                </label>
                <input
                  type="number"
                  required
                  value={configForm.minOrderForFreeDelivery}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, minOrderForFreeDelivery: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={configForm.bankName}
                  onChange={(e) => setConfigForm({ ...configForm, bankName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={configForm.accountNumber}
                  onChange={(e) => setConfigForm({ ...configForm, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={configForm.ifscCode}
                  onChange={(e) => setConfigForm({ ...configForm, ifscCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={configForm.accountHolder}
                  onChange={(e) => setConfigForm({ ...configForm, accountHolder: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-[#1B5E20] hover:bg-[#154a19] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Save Store Configuration
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: COUPON MANAGER */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-xl font-bold font-['Poppins'] text-zinc-900 dark:text-zinc-100">
              Create Promotional Discount Coupon
            </h2>

            <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE15"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 uppercase font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Discount %
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={90}
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Min Order Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-4 bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-bold rounded-xl shadow-md"
              >
                Add Coupon Code
              </button>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="bg-white dark:bg-zinc-900 border border-[#D4A017]/30 rounded-2xl p-4 shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-base font-extrabold text-[#1B5E20] dark:text-[#81C784]">
                    {c.code}
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {c.discountPercentage}% OFF (Min ₹{c.minOrderValue})
                  </p>
                </div>
                <button
                  onClick={() => toggleCoupon(c.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-full cursor-pointer ${
                    c.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-[#D4A017] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 font-['Poppins']">
              Add New Cold Pressed Oil or Cake
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Product English Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Sesame / Til Cold Pressed Oil"
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Kannada Name (Optional)
                </label>
                <input
                  type="text"
                  value={newKannadaName}
                  onChange={(e) => setNewKannadaName(e.target.value)}
                  placeholder="e.g. ಎಳ್ಳೆಣ್ಣೆ (Ellenne)"
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  >
                    <option value="edible_oil">Cold Pressed Oil</option>
                    <option value="oil_cake">Cattle Feed Oil Cake</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Image File
                  </label>
                  <select
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  >
                    <option value="/GROUNDNUT.png">GROUNDNUT.png</option>
                    <option value="/SUNFLOWER.png">SUNFLOWER.png</option>
                    <option value="/SAFFLOWER.png">SAFFLOWER.png</option>
                    <option value="/COTTON_SEED_OIL_CAKE.png">COTTON_SEED_OIL_CAKE.png</option>
                    <option value="/GROUNDNUT_OIL_CAKE.png">GROUNDNUT_OIL_CAKE.png</option>
                    <option value="/SAFFLOWER_OIL_CAKE.png">SAFFLOWER_OIL_CAKE.png</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-xs text-zinc-500 hover:text-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1B5E20] hover:bg-[#154a19] text-white text-xs font-bold rounded-xl"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
