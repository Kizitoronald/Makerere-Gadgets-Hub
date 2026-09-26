import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  MessageSquare, 
  Truck,
  MapPin
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatUGX } from '../../utils/currency';
import { BusinessSettings } from '../../types';
import { ALL_LOCATIONS } from '../../data/makerereLocations';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';

interface CartDrawerProps {
  settings: BusinessSettings;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  settings,
  onProceedToCheckout,
}) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
    deliveryDetails,
    setDeliveryDetails,
    clearCart
  } = useCart();

  if (!isCartOpen) return null;

  const handleLocationChange = (locationName: string) => {
    const loc = ALL_LOCATIONS.find(l => l.name === locationName);
    setDeliveryDetails(prev => ({
      ...prev,
      locationName,
      zoneType: loc ? loc.zone : 'hall'
    }));
  };

  const handleWhatsAppOrder = () => {
    const url = generateWhatsAppOrderUrl({
      businessPhone: settings.whatsapp,
      items,
      subtotal,
      deliveryFee,
      total,
      delivery: deliveryDetails
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-600" />
            <h2 className="font-display font-bold text-base text-slate-900">
              Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Campus Alert */}
        <div className="bg-sky-50 px-5 py-2.5 border-b border-sky-100 flex items-center gap-2 text-xs text-sky-900">
          <Truck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong>Free delivery</strong> to all Makerere halls, hostels & Kikoni
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Your cart is empty</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-xs">
                Explore our fast chargers, hot plates, earbuds, and extension cables.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3.5 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
                  {/* Item Image */}
                  <img
                    src={product.images?.[0] || '/src/assets/images/hero_gadgets_showcase_1790413151406.jpg'}
                    alt={product.name}
                    className="w-18 h-18 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                  />

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-slate-950 font-display tabular-nums mt-1">
                        {formatUGX(product.price)}
                      </div>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800 tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="p-1 hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-slate-700 tabular-nums">
                        {formatUGX(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 underline underline-offset-4"
                >
                  Clear all items
                </button>
              </div>

              {/* Delivery Destination Selector in Cart */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>Choose Delivery Destination:</span>
                </div>
                <select
                  value={deliveryDetails.locationName}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  {ALL_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} {loc.isFreeDelivery ? '(FREE Delivery)' : `(${formatUGX(settings.standardDeliveryFee)})`}
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 mt-1">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">✓ Qualified for Free Campus Delivery</span>
                  ) : (
                    <span>Standard Kampala boda fee applies for this zone</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer / Summary & Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums text-slate-900">{formatUGX(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase">FREE (Makerere)</span>
                ) : (
                  <span className="font-semibold tabular-nums text-slate-900">{formatUGX(deliveryFee)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-950 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-base font-extrabold font-display tabular-nums text-slate-950">
                  {formatUGX(total)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>ORDER ON WHATSAPP DIRECTLY</span>
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 text-center"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
