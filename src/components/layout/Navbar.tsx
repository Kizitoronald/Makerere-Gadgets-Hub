import React, { useState } from 'react';
import { ShoppingBag, Search, PhoneCall, ShieldCheck, Menu, X, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { generateWhatsAppChatUrl } from '../../utils/whatsapp';
import { BusinessSettings } from '../../types';

interface NavbarProps {
  settings: BusinessSettings;
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenSearch: () => void;
  onOpenTracking: () => void;
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeView,
  setActiveView,
  onOpenSearch,
  onOpenTracking,
  onOpenAdminLogin,
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { isAdminAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'categories', label: 'Categories' },
    { id: 'deals', label: 'Deals' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = generateWhatsAppChatUrl(settings.whatsapp);

  return (
    <>
      {/* Student Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="font-medium text-emerald-400">FREE DELIVERY</span>
            <span className="text-slate-400 hidden sm:inline">to all Makerere Halls (Mitchell, Lumumba, Mary Stuart) & Hostels</span>
          </div>
          <div className="flex items-center gap-4 shrink-0 text-xs">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-sky-400" />
              <span className="hidden md:inline">{settings.phone}</span>
              <span className="md:hidden">Call</span>
            </a>
            <button
              onClick={onOpenTracking}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Track Order
            </button>
            {isAdminAuthenticated ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="text-slate-400 hover:text-slate-200 text-[11px]"
              >
                Staff
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 1-line brand — 4-6 nav links — 1-2 primary actions */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text wordmark in display face */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-sky-400 shadow-sm font-bold text-base">
                M
              </div>
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-950 uppercase">
                {settings.businessName}
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  activeView === link.id
                    ? 'text-slate-950 font-semibold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {link.label}
                {activeView === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              aria-label="Search gadgets"
              className="p-2 text-slate-600 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WhatsApp Direct Order CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View shopping cart"
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="bg-sky-500 text-slate-950 text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeView === link.id
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTracking();
                  }}
                  className="text-left px-3 py-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  Track Existing Order
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg text-center"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
