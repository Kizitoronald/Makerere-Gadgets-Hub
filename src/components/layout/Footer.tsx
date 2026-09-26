import React from 'react';
import { PhoneCall, MapPin, MessageSquare, ShieldCheck, Truck } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { generateWhatsAppChatUrl } from '../../utils/whatsapp';

interface FooterProps {
  settings: BusinessSettings;
  onNavigate: (view: string) => void;
  onOpenTracking: () => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenTracking,
  onOpenAdminLogin,
}) => {
  const whatsappUrl = generateWhatsAppChatUrl(settings.whatsapp);

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-slate-950 font-extrabold flex items-center justify-center text-sm">
                M
              </div>
              <span className="font-display font-extrabold text-base text-white tracking-tight uppercase">
                {settings.businessName}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              "{settings.motto}" — Kampala's top electronics and gadgets destination for Makerere University students and surrounding hostels.
            </p>
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Free Delivery to Makerere Halls & Hostels</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Store Navigation
            </div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Shop All Gadgets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-white transition-colors">
                  Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('deals')} className="hover:text-white transition-colors">
                  Student Deals & Discounts
                </button>
              </li>
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition-colors">
                  Track Delivery
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Student Categories */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Top Categories
            </div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Chargers & Adapters
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Extension Cables (3m / 6-way)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Single & Double Hot Plates
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Air F9 Pro+ & TWS Earbuds
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support & Staff */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Direct Contact
            </div>
            <div className="space-y-2">
              <div className="text-[11px] text-slate-300 font-medium">
                Contact: <span className="text-white font-semibold">Kizito Ronald</span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: {settings.whatsapp}</span>
              </a>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white"
              >
                <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                <span>{settings.phone}</span>
              </a>
              <div className="text-[11px] text-slate-400">
                {settings.location}
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenAdminLogin}
                  className="text-slate-500 hover:text-slate-300 text-[11px] underline underline-offset-4"
                >
                  Admin Portal Login
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.businessName}. All rights reserved. Kampala, Uganda.
          </div>
          <div className="flex items-center gap-4">
            <span>Prices listed in Ugandan Shillings (UGX)</span>
            <span>·</span>
            <span>Cash on Delivery & MoMo Supported</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
