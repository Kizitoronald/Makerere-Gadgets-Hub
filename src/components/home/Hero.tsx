import React from 'react';
import { ArrowRight, MessageSquare, Zap, ShieldCheck, Truck } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { generateWhatsAppChatUrl } from '../../utils/whatsapp';

interface HeroProps {
  settings: BusinessSettings;
  onShopNow: () => void;
  onSelectCategory: (categoryName: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onShopNow, onSelectCategory }) => {
  const whatsappUrl = generateWhatsAppChatUrl(
    settings.whatsapp,
    "Hello Makerere Gadgets Hub! I'd like to ask about available electronics and delivery to Makerere."
  );

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Subtle background tech accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/30 via-slate-950 to-slate-950 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Campus Delivery Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-sky-950/80 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-6 w-fit">
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              <span>FREE DELIVERY TO MAKERERE HALLS & HOSTELS</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.1] mb-5">
              {settings.motto || 'YOUR NUMBER ONE TECH EXPERTS'}
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
              Quality gadgets. Affordable prices. Convenient express delivery to Mitchell, Lumumba, Mary Stuart, Olympia, Douglas Villa, Kikoni & Kikumi.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <button
                onClick={onShopNow}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98]"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>ORDER ON WHATSAPP</span>
              </a>
            </div>

            {/* Quick Proof Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Fast Dispatch</div>
                  <div className="text-slate-400 text-xs">Within 30-45 mins</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Tested Quality</div>
                  <div className="text-slate-400 text-xs">Tested before handoff</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Pay On Delivery</div>
                  <div className="text-slate-400 text-xs">Cash or Mobile Money</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <img
                src="/src/assets/images/hero_gadgets_showcase_1790413151406.jpg"
                alt="Makerere Gadgets Hub inventory of chargers, earbuds, and extension cords"
                className="w-full h-[320px] sm:h-[400px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Highlight Card */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-sky-400 font-semibold uppercase tracking-wider">Campus Special</div>
                  <div className="text-sm font-bold text-white">65W GaN Fast Charger & Cables</div>
                  <div className="text-xs text-slate-300">From UGX 18,000</div>
                </div>
                <button
                  onClick={() => onSelectCategory('Chargers & Adapters')}
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
