import React from 'react';
import { 
  CheckCircle2, 
  MessageSquare, 
  Search, 
  ShoppingBag, 
  MapPin, 
  Copy, 
  Check
} from 'lucide-react';
import { Order, BusinessSettings } from '../../types';
import { formatUGX } from '../../utils/currency';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';
import { useToast } from '../common/Toast';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  settings: BusinessSettings;
  onTrackOrder: (orderNumber: string, phone: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  settings,
  onTrackOrder,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    showToast(`Order reference ${order.orderNumber} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppSend = () => {
    const url = generateWhatsAppOrderUrl({
      businessPhone: settings.whatsapp,
      orderNumber: order.orderNumber,
      items: order.items,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      customer: order.customer,
      delivery: order.deliveryDetails,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Title */}
        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-950 uppercase tracking-tight">
          ORDER RECEIVED!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Thank you for shopping with Makerere Gadgets Hub.
        </p>

        {/* Order Number Badge */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Your Order Reference Number
          </div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="font-display font-extrabold text-xl text-sky-600 tracking-wide">
              {order.orderNumber}
            </span>
            <button
              onClick={handleCopyOrderNumber}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
              title="Copy Order Number"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Your order has been recorded and will be prepared for dispatch shortly.
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-5 text-left p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-start gap-2 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Delivery To: </span>
              <span>{order.deliveryDetails.locationName}</span>
              {order.deliveryDetails.roomOrBlock && (
                <span> ({order.deliveryDetails.roomOrBlock})</span>
              )}
            </div>
          </div>
          <div className="flex justify-between text-slate-700 pt-2 border-t border-slate-200">
            <span>Customer:</span>
            <span className="font-semibold">{order.customer.name} ({order.customer.phone})</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>Payment Method:</span>
            <span className="font-semibold uppercase">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : `Mobile Money (${order.paymentProvider || 'MTN/Airtel'})`}
            </span>
          </div>
          <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
            <span>Total to Pay:</span>
            <span className="font-display tabular-nums text-slate-950">{formatUGX(order.total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={() => {
              onClose();
              onTrackOrder(order.orderNumber, order.customer.phone);
            }}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Search className="w-4 h-4 text-sky-400" />
            <span>TRACK ORDER LIVE</span>
          </button>

          <button
            onClick={handleWhatsAppSend}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>CONFIRM ON WHATSAPP WITH DISPATCH</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};
