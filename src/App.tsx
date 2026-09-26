import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { TrustBanner } from './components/home/TrustBanner';
import { CategoryGrid } from './components/home/CategoryGrid';
import { ProductFilterBar } from './components/products/ProductFilterBar';
import { ProductCard } from './components/products/ProductCard';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderConfirmationModal } from './components/checkout/OrderConfirmationModal';
import { OrderTrackingModal } from './components/tracking/OrderTrackingModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AboutDeliverySection } from './components/home/AboutDeliverySection';
import { ToastProvider, useToast } from './components/common/Toast';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  getProducts, 
  getCategories, 
  getBusinessSettings, 
  initDatabase 
} from './services/storage';
import { Product, Category, BusinessSettings, Order } from './types';
import { Sparkles, ArrowRight, PackageSearch } from 'lucide-react';

function MainStoreContent() {
  const { showToast } = useToast();
  const { addToCart, setIsCartOpen } = useCart();
  const { isAdminAuthenticated } = useAuth();

  // Navigation State
  const [activeView, setActiveView] = useState<string>('home');

  // Business and Catalog data from local persistence
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(getBusinessSettings());

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [dealsOnly, setDealsOnly] = useState(false);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [trackPrefill, setTrackPrefill] = useState({ orderNumber: '', phone: '' });

  // Initialise database and listeners
  const refreshData = () => {
    initDatabase();
    setProducts(getProducts());
    setCategories(getCategories());
    setSettings(getBusinessSettings());
  };

  useEffect(() => {
    refreshData();

    const handleStorageUpdate = () => refreshData();
    window.addEventListener('mgh_db_update', handleStorageUpdate);
    return () => window.removeEventListener('mgh_db_update', handleStorageUpdate);
  }, []);

  // Sync deals tab with deals filter
  useEffect(() => {
    if (activeView === 'deals') {
      setDealsOnly(true);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } else if (activeView === 'categories') {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }, [activeView]);

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter (name, description, specs, category)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // In Stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        // Deals only filter
        if (dealsOnly) {
          const discount = p.discountPercentage || 0;
          const hasPrev = p.previousPrice && p.previousPrice > p.price;
          if (discount <= 0 && !hasPrev) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'discount') {
          const discA = a.discountPercentage || 0;
          const discB = b.discountPercentage || 0;
          return discB - discA;
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Default: popular / featured first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [products, searchQuery, selectedCategory, sortBy, inStockOnly, dealsOnly]);

  // Featured Highlights for Hero
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured).slice(0, 4);
  }, [products]);

  // Handlers
  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  const handleBuyNowFromModal = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  const handleTrackSpecificOrder = (orderNumber: string, phone: string) => {
    setTrackPrefill({ orderNumber, phone });
    setIsTrackingOpen(true);
  };

  // If Admin view is chosen and authenticated, show Admin Dashboard
  if (activeView === 'admin' && isAdminAuthenticated) {
    return (
      <AdminDashboard onBackToShop={() => setActiveView('home')} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* Top Navigation Bar */}
      <Navbar
        settings={settings}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSearch={() => {
          const el = document.getElementById('catalog-search-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenTracking={() => {
          setTrackPrefill({ orderNumber: '', phone: '' });
          setIsTrackingOpen(true);
        }}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        settings={settings}
        onShopNow={() => {
          const el = document.getElementById('catalog-search-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectCategory={(catName) => {
          setSelectedCategory(catName);
          const el = document.getElementById('catalog-search-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Trust & Guarantee Strip */}
      <TrustBanner />

      {/* 12 Categories Carousel / Grid */}
      <CategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(catName) => {
          setSelectedCategory(catName);
          const el = document.getElementById('catalog-search-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Catalog Section */}
      <div id="catalog-search-section" className="scroll-mt-20">
        
        {/* Sticky Filter & Search Bar */}
        <ProductFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          sortBy={sortBy}
          setSortBy={setSortBy}
          inStockOnly={inStockOnly}
          setInStockOnly={setInStockOnly}
          dealsOnly={dealsOnly}
          setDealsOnly={setDealsOnly}
          totalProductsCount={filteredProducts.length}
        />

        {/* Catalog Body */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 pb-3 border-b border-slate-200">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {selectedCategory !== 'all' ? selectedCategory : dealsOnly ? 'Student Deals & Discounts' : 'All Electronics & Gadgets'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic stock with free delivery to Makerere halls & hostels
              </p>
            </div>

            {/* Active Filters tag */}
            {(selectedCategory !== 'all' || searchQuery || dealsOnly || inStockOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setDealsOnly(false);
                  setInStockOnly(false);
                }}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold underline underline-offset-4 mt-2 sm:mt-0"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsappPhone={settings.whatsapp}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-20 text-center flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <PackageSearch className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                No gadgets found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-5">
                We couldn't find any gadgets matching "{searchQuery || selectedCategory}". Try searching for another product like "charger", "earbuds", or "extension".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setDealsOnly(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                View All Available Gadgets
              </button>
            </div>
          )}

        </section>
      </div>

      {/* About & Campus Delivery & Contact Sections */}
      <AboutDeliverySection settings={settings} />

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={(view) => {
          setActiveView(view);
          if (view === 'shop') {
            const el = document.getElementById('catalog-search-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else if (view === 'categories') {
            window.scrollTo({ top: 400, behavior: 'smooth' });
          } else if (view === 'deals') {
            setDealsOnly(true);
            const el = document.getElementById('catalog-search-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
            const el = document.getElementById(view);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenTracking={() => {
          setTrackPrefill({ orderNumber: '', phone: '' });
          setIsTrackingOpen(true);
        }}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* ================= MODALS & DRAWERS ================= */}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
          onBuyNowCheckout={handleBuyNowFromModal}
        />
      )}

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        settings={settings}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        settings={settings}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => {
          setPlacedOrder(order);
        }}
      />

      {/* Order Confirmation Modal */}
      {placedOrder && (
        <OrderConfirmationModal
          order={placedOrder}
          settings={settings}
          onClose={() => setPlacedOrder(null)}
          onTrackOrder={(orderNumber, phone) => {
            setPlacedOrder(null);
            handleTrackSpecificOrder(orderNumber, phone);
          }}
        />
      )}

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        settings={settings}
        initialOrderNumber={trackPrefill.orderNumber}
        initialPhone={trackPrefill.phone}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => setActiveView('admin')}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <MainStoreContent />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
