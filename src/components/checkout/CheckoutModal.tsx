import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  MapPin, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatUGX } from '../../utils/currency';
import { BusinessSettings, CustomerInfo, PaymentMethod, Order } from '../../types';
import { ALL_LOCATIONS } from '../../data/makerereLocations';
import { createOrder } from '../../services/storage';
import { useToast } from '../common/Toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BusinessSettings;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  settings,
  onOrderSuccess,
}) => {
  const { items, subtotal, deliveryFee, total, deliveryDetails, setDeliveryDetails, clearCart } = useCart();
  const { showToast } = useToast();

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
  });

  const [samePhoneForWhatsApp, setSamePhoneForWhatsApp] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'airtel'>('mtn');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLocationChange = (locationName: string) => {
    const loc = ALL_LOCATIONS.find(l => l.name === locationName);
    setDeliveryDetails(prev => ({
      ...prev,
      locationName,
      zoneType: loc ? loc.zone : 'hall'
    }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!customer.name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    if (!customer.phone.trim() || customer.phone.replace(/\D/g, '').length < 9) {
      setErrorMsg('Please enter a valid Ugandan phone number (e.g. 0772123456)');
      return;
    }

    if (!deliveryDetails.locationName) {
      setErrorMsg('Please select your Makerere hall, hostel, or delivery location');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalWhatsApp = samePhoneForWhatsApp ? customer.phone : (customer.whatsapp || customer.phone);

      const orderData = {
        customer: {
          ...customer,
          whatsapp: finalWhatsApp,
        },
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images?.[0]
        })),
        subtotal,
        deliveryFee,
        total,
        deliveryDetails,
        paymentMethod,
        paymentProvider: paymentMethod === 'mobile_money' ? momoProvider : undefined,
        status: 'pending' as const,
      };

      const createdOrder = createOrder(orderData);
      clearCart();
      showToast(`Order #${createdOrder.orderNumber} placed successfully!`);
      setIsSubmitting(false);
      onOrderSuccess(createdOrder);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while creating your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900">
              Campus Express Checkout
            </h2>
            <p className="text-xs text-slate-500">
              Free delivery straight to your Makerere hall room or hostel gate
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Customer Contact Information */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">1</span>
              <span>Your Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Bosco"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number for Delivery Call <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="07XXXXXXXX"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={samePhoneForWhatsApp}
                    onChange={(e) => setSamePhoneForWhatsApp(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>Same number is on WhatsApp for order confirmation</span>
                </label>
                {!samePhoneForWhatsApp && (
                  <div className="mt-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="07XXXXXXXX (WhatsApp)"
                      value={customer.whatsapp}
                      onChange={(e) => setCustomer({ ...customer, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Makerere Campus Delivery Details */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">2</span>
              <span>Delivery Location (Makerere Area)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Hall or Hostel <span className="text-red-500">*</span>
                </label>
                <select
                  value={deliveryDetails.locationName}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white font-medium text-slate-900"
                >
                  <optgroup label="Makerere Halls of Residence (Free Delivery)">
                    {ALL_LOCATIONS.filter(l => l.zone === 'hall').map(loc => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name} — FREE Delivery
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Popular Student Hostels (Free Delivery)">
                    {ALL_LOCATIONS.filter(l => l.zone === 'hostel').map(loc => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name} — FREE Delivery
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Nearby Trading Areas (Free Delivery)">
                    {ALL_LOCATIONS.filter(l => l.zone === 'kikoni' || l.zone === 'kikumi').map(loc => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name} — FREE Delivery
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Locations (Standard Fee Applies)">
                    {ALL_LOCATIONS.filter(l => l.zone === 'other').map(loc => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Room # / Block / Wing
                </label>
                <input
                  type="text"
                  placeholder="e.g. Block B, Room 14"
                  value={deliveryDetails.roomOrBlock}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, roomOrBlock: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nearby Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near main canteen / security gate"
                  value={deliveryDetails.landmark}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, landmark: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Notes / Special Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please call me when you reach the dining hall gate"
                  value={deliveryDetails.instructions}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, instructions: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">3</span>
              <span>Payment Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-sky-500 bg-sky-50/50 ring-1 ring-sky-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs text-slate-900">Cash on Delivery</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Inspect and test your gadget with our delivery rider before handing over cash.
                </p>
              </label>

              {/* Mobile Money */}
              <label
                onClick={() => setPaymentMethod('mobile_money')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'mobile_money'
                    ? 'border-sky-500 bg-sky-50/50 ring-1 ring-sky-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xs text-slate-900">Mobile Money (MTN / Airtel)</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'mobile_money'}
                    onChange={() => setPaymentMethod('mobile_money')}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Pay instantly via MTN MoMo or Airtel Money to our merchant line upon arrival.
                </p>
              </label>
            </div>

            {/* Mobile money provider selection if chosen */}
            {paymentMethod === 'mobile_money' && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-2">
                <div className="font-semibold text-amber-900">Choose Network:</div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="momoProvider"
                      checked={momoProvider === 'mtn'}
                      onChange={() => setMomoProvider('mtn')}
                      className="text-amber-600"
                    />
                    <span className="font-bold text-amber-900">MTN Mobile Money</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="momoProvider"
                      checked={momoProvider === 'airtel'}
                      onChange={() => setMomoProvider('airtel')}
                      className="text-red-600"
                    />
                    <span className="font-bold text-red-900">Airtel Money</span>
                  </label>
                </div>
                <p className="text-[11px] text-amber-800">
                  Note: You will confirm prompt or dial merchant code with rider at delivery point ({settings.phone}).
                </p>
              </div>
            )}
          </div>

          {/* Order Items Review */}
          <div className="pt-3 border-t border-slate-200">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">Order Items:</h4>
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-xs text-slate-700">
                  <span className="line-clamp-1">{quantity} × {product.name}</span>
                  <span className="font-semibold tabular-nums text-slate-900 shrink-0 ml-2">
                    {formatUGX(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span className="font-semibold tabular-nums">{formatUGX(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Campus Delivery</span>
              {deliveryFee === 0 ? (
                <span className="text-emerald-400 font-bold uppercase">FREE</span>
              ) : (
                <span className="tabular-nums font-semibold">{formatUGX(deliveryFee)}</span>
              )}
            </div>
            <div className="flex justify-between text-base font-extrabold pt-2 border-t border-slate-800 text-white">
              <span>Total Payable</span>
              <span className="text-sky-400 font-display tabular-nums">{formatUGX(total)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <span>CONFIRM & PLACE ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
