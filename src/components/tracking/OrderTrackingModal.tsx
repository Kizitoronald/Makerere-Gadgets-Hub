import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  PhoneCall, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus, BusinessSettings } from '../../types';
import { getOrderByNumberAndPhone } from '../../services/storage';
import { formatUGX } from '../../utils/currency';
import { generateWhatsAppChatUrl } from '../../utils/whatsapp';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BusinessSettings;
  initialOrderNumber?: string;
  initialPhone?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  settings,
  initialOrderNumber = '',
  initialPhone = '',
}) => {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If initial props supplied, search automatically
  React.useEffect(() => {
    if (initialOrderNumber && initialPhone) {
      setOrderNumber(initialOrderNumber);
      setPhone(initialPhone);
      const found = getOrderByNumberAndPhone(initialOrderNumber, initialPhone);
      if (found) {
        setOrder(found);
        setHasSearched(true);
      }
    }
  }, [initialOrderNumber, initialPhone]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setHasSearched(true);

    if (!orderNumber.trim() || !phone.trim()) {
      setErrorMessage('Please provide both Order Number and Phone Number.');
      setOrder(null);
      return;
    }

    const found = getOrderByNumberAndPhone(orderNumber, phone);
    if (found) {
      setOrder(found);
      setErrorMessage('');
    } else {
      setOrder(null);
      setErrorMessage('No matching order found. Please check your order reference and phone number.');
    }
  };

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'pending', label: 'Order Received', desc: 'Your order was logged in our system' },
    { key: 'confirmed', label: 'Order Confirmed', desc: 'Order reviewed by dispatcher' },
    { key: 'processing', label: 'Preparing Order', desc: 'Gadgets tested & packed at Kikoni hub' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Boda rider is in transit to your hall/hostel' },
    { key: 'delivered', label: 'Delivered', desc: 'Package handed over and payment received' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'ready': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-600" />
            <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
              Track Campus Delivery
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Tracking Form */}
          <form onSubmit={handleSearch} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. MGH-001038"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white uppercase font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number Used
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0772123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEARCH ORDER STATUS</span>
            </button>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Order Details & Progress Indicator */}
          {order && (
            <div className="space-y-6 pt-2">
              {/* Order Status Card */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-sky-400 font-bold uppercase tracking-wider">Order Status</div>
                  <div className="text-lg font-bold capitalize">
                    {order.status.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Order Ref: <span className="text-white font-mono">{order.orderNumber}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total</div>
                  <div className="text-base font-extrabold text-white font-display tabular-nums">
                    {formatUGX(order.total)}
                  </div>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              {isCancelled ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                  <strong>Order Cancelled.</strong> This order has been marked as cancelled. If this is a mistake, please reach out to us on WhatsApp.
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Delivery Milestones</h4>
                  <div className="space-y-4 pl-2">
                    {steps.map((step, index) => {
                      const isCompleted = currentStepIndex > index;
                      const isCurrent = currentStepIndex === index;

                      return (
                        <div key={step.key} className="flex items-start gap-3.5 relative">
                          {/* Vertical line between steps */}
                          {index < steps.length - 1 && (
                            <div 
                              className={`absolute left-[13px] top-6 bottom-[-16px] w-0.5 ${
                                isCompleted ? 'bg-sky-500' : 'bg-slate-200'
                              }`} 
                            />
                          )}

                          {/* Node Icon */}
                          <div 
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold transition-colors ${
                              isCompleted
                                ? 'bg-sky-500 text-slate-950 ring-4 ring-sky-100'
                                : isCurrent
                                ? 'bg-slate-900 text-sky-400 ring-4 ring-sky-200 animate-pulse'
                                : 'bg-slate-100 text-slate-400 border border-slate-300'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                          </div>

                          <div className="flex-1 pb-1">
                            <div className="flex items-center justify-between">
                              <h5 className={`text-xs font-bold ${isCurrent ? 'text-sky-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                                {step.label}
                              </h5>
                              {isCurrent && (
                                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  Current Status
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>Destination: {order.deliveryDetails.locationName}</span>
                </div>
                {order.deliveryDetails.roomOrBlock && (
                  <div>Room / Block: <span className="font-semibold">{order.deliveryDetails.roomOrBlock}</span></div>
                )}
                {order.deliveryDetails.landmark && (
                  <div>Landmark: <span className="font-semibold">{order.deliveryDetails.landmark}</span></div>
                )}
                <div>Customer Name: <span className="font-semibold">{order.customer.name}</span></div>
              </div>

              {/* Items summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Ordered Items</h4>
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity} × {item.name}</span>
                      <span className="font-semibold tabular-nums">{formatUGX(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispatch Contact Actions */}
              <div className="flex gap-2">
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                  <span>Call Dispatch Rider</span>
                </a>
                <a
                  href={generateWhatsAppChatUrl(settings.whatsapp, `Hello Makerere Gadgets Hub, I am inquiring about my order ${order.orderNumber}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Quick Help note */}
          {!order && hasSearched && !errorMessage && (
            <div className="text-center py-6 text-slate-500 text-xs">
              Need assistance? Call our campus dispatcher at{' '}
              <a href={`tel:${settings.phone}`} className="text-sky-600 font-bold underline">
                {settings.phone}
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
