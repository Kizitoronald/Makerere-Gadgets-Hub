import React from 'react';
import { 
  ShieldCheck, 
  Tag, 
  Truck, 
  Headphones, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  Mail,
  CheckCircle2
} from 'lucide-react';
import { BusinessSettings } from '../../types';
import { generateWhatsAppChatUrl } from '../../utils/whatsapp';
import { ALL_LOCATIONS } from '../../data/makerereLocations';

interface AboutDeliverySectionProps {
  settings: BusinessSettings;
}

export const AboutDeliverySection: React.FC<AboutDeliverySectionProps> = ({ settings }) => {
  const whatsappUrl = generateWhatsAppChatUrl(settings.whatsapp);

  const halls = ALL_LOCATIONS.filter(l => l.zone === 'hall').slice(0, 8);
  const hostels = ALL_LOCATIONS.filter(l => l.zone === 'hostel').slice(0, 8);

  return (
    <div className="space-y-16 py-12 bg-white">
      
      {/* 1. About Makerere Gadgets Hub */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
              About Makerere Gadgets Hub
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-950 uppercase tracking-tight">
              {settings.motto || 'YOUR NUMBER ONE TECH EXPERTS'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Makerere Gadgets Hub is an electronics and gadgets business serving Makerere University students, staff, and the surrounding community with affordable, tested, and reliable technology products.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We understand campus life — from the urgent need to charge your phone before an 8:00 AM test at Senate or CoBAMS, to cooking meals in your hostel room with safe electric hot plates, to late night library study sessions with silent mice and noise-cancelling headphones.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-sky-600 mb-1.5" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Quality Products</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Every gadget is tested before handoff</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <Tag className="w-5 h-5 text-emerald-600 mb-1.5" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Student Pricing</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Genuine electronics at honest UGX rates</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <Truck className="w-5 h-5 text-sky-600 mb-1.5" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Convenient Delivery</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Free dispatch to all campus halls & hostels</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <Headphones className="w-5 h-5 text-purple-600 mb-1.5" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Customer Support</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Immediate assistance on WhatsApp and phone</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
              <img
                src="/src/assets/images/hero_gadgets_showcase_1790413151406.jpg"
                alt="Makerere Gadgets Hub store collection"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg text-slate-900">
                <div className="font-bold text-sm">Serving the Makerere Community Daily</div>
                <div className="text-xs text-slate-600 mt-1">
                  Over 1,000+ satisfied students across Mitchell, Lumumba, Mary Stuart, Olympia, Kikoni and Kikumi.
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Free Delivery Zone Guide */}
      <section id="delivery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Campus Delivery Policy
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase mt-1">
              FREE DELIVERY TO MAKERERE HALLS & HOSTELS
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              You do not need to walk to town or Wandegeya when you need an extension cord or fast charger. Our dedicated campus riders deliver directly to your hall of residence or hostel entrance with zero delivery fee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-800 text-xs">
            {/* Halls List */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-sky-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Makerere Halls of Residence (Free)</span>
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-slate-300">
                {halls.map(h => (
                  <div key={h.id} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span className="truncate">{h.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hostels List */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-sky-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Hostels & Nearby Areas (Free)</span>
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-slate-300">
                {hostels.map(h => (
                  <div key={h.id} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span className="truncate">{h.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Contact Information & Hours */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border border-slate-200 rounded-2xl p-6 sm:p-10 bg-slate-50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
                Get in Touch
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950 uppercase">
                Contact Makerere Gadgets Hub
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Need product advice, bulk orders for hostel roommates, or urgent delivery? Speak with our team.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Location:</span>
                    <p className="text-slate-600">{settings.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Business Hours:</span>
                    <p className="text-slate-600">{settings.businessHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <PhoneCall className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Contact Person / Phone:</span>
                    <p className="text-slate-700 font-semibold">Kizito Ronald</p>
                    <p className="text-slate-600 font-mono text-[11px]">{settings.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Email:</span>
                    <p className="text-slate-600">{settings.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact CTAs */}
            <div className="lg:col-span-5 flex flex-col gap-3 p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="font-bold text-sm text-slate-900 mb-1">
                Fast Contact Options:
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>CHAT ON WHATSAPP</span>
              </a>

              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <PhoneCall className="w-4 h-4 text-sky-400" />
                <span>CALL US NOW</span>
              </a>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
