import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  Settings as SettingsIcon, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  ArrowLeft,
  CheckCircle2, 
  Clock, 
  Truck, 
  RotateCcw,
  Search,
  Eye,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Product, Category, Order, OrderStatus, BusinessSettings, CustomerRecord } from '../../types';
import { 
  getProducts, 
  saveProduct, 
  deleteProduct, 
  getCategories, 
  getOrders, 
  updateOrderStatus, 
  getCustomers, 
  getBusinessSettings, 
  updateBusinessSettings, 
  resetDatabaseToDefaults 
} from '../../services/storage';
import { formatUGX } from '../../utils/currency';
import { useToast } from '../common/Toast';
import { AdminProductForm } from './AdminProductForm';
import { AdminOrderDetailsModal } from './AdminOrderDetailsModal';
import { generateWhatsAppChatUrl } from '../../utils/whatsapp';

interface AdminDashboardProps {
  onBackToShop: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToShop }) => {
  const { logoutAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'settings'>('overview');
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(getBusinessSettings());

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Settings form states
  const [settingsFormData, setSettingsFormData] = useState<BusinessSettings>(settings);

  const loadData = () => {
    setProducts(getProducts());
    setCategories(getCategories());
    setOrders(getOrders());
    setCustomers(getCustomers());
    const currSettings = getBusinessSettings();
    setSettings(currSettings);
    setSettingsFormData(currSettings);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('mgh_db_update', handleUpdate);
    return () => window.removeEventListener('mgh_db_update', handleUpdate);
  }, []);

  // Handlers for Products
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = (prod: Product) => {
    saveProduct(prod);
    setIsProductFormOpen(false);
    showToast(`Product "${prod.name}" saved successfully`);
    loadData();
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      deleteProduct(id);
      showToast(`Removed "${name}"`);
      loadData();
    }
  };

  // Handlers for Orders
  const handleUpdateStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const updated = updateOrderStatus(orderId, status, note);
    if (updated) {
      showToast(`Order #${updated.orderNumber} updated to ${status.replace(/_/g, ' ')}`);
      loadData();
      if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
        setSelectedOrderDetails(updated);
      }
    }
  };

  // Handlers for Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessSettings(settingsFormData);
    showToast('Business settings updated successfully');
    loadData();
  };

  const handleResetData = () => {
    if (window.confirm('Reset all inventory and sample orders to original Makerere Gadgets Hub seed data?')) {
      resetDatabaseToDefaults();
      showToast('Database reset to defaults');
      loadData();
    }
  };

  // Analytics Computations
  const totalSales = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = orders
    .filter(o => o.status !== 'cancelled' && o.createdAt.startsWith(todayStr))
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const completedOrdersCount = orders.filter(o => o.status === 'delivered').length;
  const lowStockProducts = products.filter(p => p.stock <= settings.lowStockThreshold);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    return p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
           p.category.toLowerCase().includes(productSearch.toLowerCase());
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchSearch = o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.customer.phone.includes(orderSearch);
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToShop}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                <span>{settings.businessName}</span>
                <span className="text-[10px] bg-sky-500 text-slate-950 px-2 py-0.5 rounded font-black">
                  ADMIN
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToShop}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold hidden sm:inline"
            >
              View Live Storefront
            </button>
            <button
              onClick={() => {
                logoutAdmin();
                showToast('Logged out of Admin');
                onBackToShop();
              }}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 sm:gap-2 overflow-x-auto text-xs border-t border-slate-800">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
            { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
            { id: 'settings', label: 'Business Settings', icon: SettingsIcon },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-sky-400 text-sky-400 bg-slate-900/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales (UGX)</div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-display tabular-nums mt-1">
                  {formatUGX(totalSales)}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  From {orders.length} total orders
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Sales</div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-display tabular-nums mt-1">
                  {formatUGX(todaySales)}
                </div>
                <div className="text-[11px] text-sky-600 font-semibold mt-1">
                  Express campus drops
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Orders</div>
                <div className="text-xl sm:text-2xl font-black text-amber-600 font-display tabular-nums mt-1">
                  {pendingOrdersCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {completedOrdersCount} successfully delivered
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Inventory</div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-display tabular-nums mt-1">
                  {products.length} Gadgets
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {lowStockProducts.length > 0 ? (
                    <span className="text-rose-600 font-semibold">{lowStockProducts.length} low in stock</span>
                  ) : (
                    <span className="text-emerald-600">All well-stocked</span>
                  )}
                </div>
              </div>
            </div>

            {/* Low Stock Warning Banner if any */}
            {lowStockProducts.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">Inventory Notice: </span>
                    {lowStockProducts.map(p => `${p.name} (${p.stock} left)`).join(', ')}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0"
                >
                  Restock Now
                </button>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Recent Orders at Makerere
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Order Ref</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Destination</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{order.orderNumber}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{order.customer.name}</div>
                          <div className="text-slate-400 text-[11px]">{order.customer.phone}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{order.deliveryDetails.locationName}</td>
                        <td className="py-3 px-3 font-bold tabular-nums text-slate-950 font-display">
                          {formatUGX(order.total)}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'out_for_delivery' ? 'bg-sky-100 text-sky-800' :
                            order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="View Order"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= PRODUCTS TAB ================= */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Inventory & Products ({products.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Manage stock levels, Ugandan prices, images, and category assignments
                </p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 text-sky-400" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Filter / Search Bar */}
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-slate-50"
              />
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Price (UGX)</th>
                    <th className="py-2.5 px-3">Stock Level</th>
                    <th className="py-2.5 px-3">Featured</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(prod => {
                    const isLowStock = prod.stock <= settings.lowStockThreshold;
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={prod.images?.[0] || '/src/assets/images/hero_gadgets_showcase_1790413151406.jpg'}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border"
                            />
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{prod.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{prod.category}</td>
                        <td className="py-3 px-3 font-bold tabular-nums text-slate-950 font-display">
                          {formatUGX(prod.price)}
                          {prod.previousPrice && (
                            <span className="block text-[10px] text-slate-400 line-through">
                              {formatUGX(prod.previousPrice)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {prod.stock === 0 ? (
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                              Out of stock
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                              {prod.stock} left (Low)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium text-[10px]">
                              {prod.stock} in stock
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {prod.featured ? (
                            <span className="text-sky-600 font-bold text-[10px]">Yes</span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">No</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= ORDERS TAB ================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Customer Orders ({orders.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Track delivery progress, update statuses, and message students
                </p>
              </div>
            </div>

            {/* Search and Status Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order ref, customer name or phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-slate-50"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="py-2 px-3 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-800 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Order Number</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Hall / Hostel</th>
                    <th className="py-2.5 px-3">Products</th>
                    <th className="py-2.5 px-3">Total (UGX)</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{order.customer.name}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{order.customer.phone}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{order.deliveryDetails.locationName}</div>
                        {order.deliveryDetails.roomOrBlock && (
                          <div className="text-[11px] text-slate-400">{order.deliveryDetails.roomOrBlock}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                      </td>
                      <td className="py-3 px-3 font-bold tabular-nums text-slate-950 font-display">
                        {formatUGX(order.total)}
                      </td>
                      <td className="py-3 px-3 uppercase text-[10px] font-semibold text-slate-700">
                        {order.paymentMethod === 'cod' ? 'Cash' : `MoMo (${order.paymentProvider || 'MTN'})`}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-[11px] font-bold p-1 rounded-md border capitalize ${
                            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            order.status === 'out_for_delivery' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                            order.status === 'cancelled' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                            'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="ready">Ready</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={generateWhatsAppChatUrl(
                              order.customer.whatsapp || order.customer.phone,
                              `Hello ${order.customer.name}, Makerere Gadgets Hub is checking in about order ${order.orderNumber}.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                            title="Chat with Customer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= CUSTOMERS TAB ================= */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Customer Database ({customers.length})
              </h3>
              <p className="text-xs text-slate-500">
                Makerere students, staff, and hostel residents who have placed orders
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Customer Name</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Primary Hall / Hostel</th>
                    <th className="py-2.5 px-3">Orders Count</th>
                    <th className="py-2.5 px-3">Total Spend (UGX)</th>
                    <th className="py-2.5 px-3">Last Order</th>
                    <th className="py-2.5 px-3 text-right">WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map(cust => (
                    <tr key={cust.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-bold text-slate-900">{cust.name}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{cust.phone}</td>
                      <td className="py-3 px-3 text-slate-700">{cust.primaryLocation}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{cust.ordersCount}</td>
                      <td className="py-3 px-3 font-bold tabular-nums text-slate-950 font-display">
                        {formatUGX(cust.totalSpent)}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {new Date(cust.lastOrderDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={generateWhatsAppChatUrl(cust.whatsapp || cust.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md font-semibold text-[11px]"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Chat</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= SETTINGS TAB ================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 max-w-3xl">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Business & Delivery Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure WhatsApp numbers, delivery fees, business location and contact info
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={settingsFormData.businessName}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, businessName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Business Motto
                  </label>
                  <input
                    type="text"
                    value={settingsFormData.motto}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, motto: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    WhatsApp Business Phone (Digits or Format)
                  </label>
                  <input
                    type="text"
                    value={settingsFormData.whatsapp}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Used for all dynamic WhatsApp ordering links across the app
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Customer Hotline / Phone
                  </label>
                  <input
                    type="text"
                    value={settingsFormData.phone}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Physical Store Location (Around Makerere)
                  </label>
                  <input
                    type="text"
                    value={settingsFormData.location}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Standard Delivery Fee Outside Makerere (UGX)
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={settingsFormData.standardDeliveryFee}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, standardDeliveryFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Low Stock Alert Threshold (Units)
                  </label>
                  <input
                    type="number"
                    value={settingsFormData.lowStockThreshold}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-3.5 py-2 text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Original Seed Data</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
                >
                  Save Business Settings
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Modals */}
      {isProductFormOpen && (
        <AdminProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => setIsProductFormOpen(false)}
          onSave={handleSaveProduct}
        />
      )}

      {selectedOrderDetails && (
        <AdminOrderDetailsModal
          order={selectedOrderDetails}
          settings={settings}
          onClose={() => setSelectedOrderDetails(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};
