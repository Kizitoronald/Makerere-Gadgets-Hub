import React from 'react';
import { Truck, Shield, Clock, Phone } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  return (
    <div className="bg-slate-900 border-y border-slate-800 py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-200">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400 shrink-0 border border-sky-800/40">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Free Hall Delivery</div>
            <div className="text-xs text-slate-400">Right to your room/hostel gate</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400 shrink-0 border border-sky-800/40">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Tested Quality</div>
            <div className="text-xs text-slate-400">We inspect gadgets before dispatch</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400 shrink-0 border border-sky-800/40">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Rapid 30-Min Drop</div>
            <div className="text-xs text-slate-400">Fast boda riders on standby</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400 shrink-0 border border-sky-800/40">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Cash & MoMo on Drop</div>
            <div className="text-xs text-slate-400">Inspect gadget before paying</div>
          </div>
        </div>

      </div>
    </div>
  );
};
