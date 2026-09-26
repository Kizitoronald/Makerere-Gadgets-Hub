import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  Zap, 
  MessageSquare, 
  Truck, 
  ShieldCheck, 
  Star, 
  Plus, 
  Minus,
  MapPin
} from 'lucide-react';
import { Product, BusinessSettings } from '../../types';
import { formatUGX, calculateDiscount } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useToast } from '../common/Toast';
import { generateWhatsAppOrderUrl } from '../../utils/whatsapp';
import { ALL_LOCATIONS } from '../../data/makerereLocations';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  settings: BusinessSettings;
  onBuyNowCheckout: (product: Product, quantity: number, hallLocation?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  settings,
  onBuyNowCheckout,
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedHall, setSelectedHall] = useState('Mitchell Hall');
  const [customRoom, setCustomRoom] = useState('');

  if (!product) return null;

  const discount = product.discountPercentage || calculateDiscount(product.price, product.previousPrice);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    showToast(`Added ${quantity} × "${product.name}" to cart`);
    onClose();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    onBuyNowCheckout(product, quantity, `${selectedHall}${customRoom ? ` (${customRoom})` : ''}`);
    onClose();
  };

  const handleDirectWhatsAppOrder = () => {
    const url = generateWhatsAppOrderUrl({
      businessPhone: settings.whatsapp,
      items: [{ name: product.name, price: product.price, quantity }],
      subtotal: product.price * quantity,
      deliveryFee: 0,
      total: product.price * quantity,
      delivery: {
        zoneType: 'hall',
        locationName: selectedHall,
        roomOrBlock: customRoom || 'Hostel Room',
      }
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const mainImage = product.images?.[0] || '/src/assets/images/hero_gadgets_showcase_1790413151406.jpg';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="uppercase text-slate-700 font-bold">{product.category}</span>
            <span>·</span>
            <span>Ref: {product.slug}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Product Imagery */}
            <div className="flex flex-col gap-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded shadow-md">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Campus Delivery Guarantee Box */}
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sky-900">Free Delivery to Makerere Halls & Hostels</div>
                  <div className="text-sky-800 text-[11px] mt-0.5">
                    Order now and receive at your hall or hostel within 30-45 minutes. Cash or MoMo on delivery.
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount || 20} customer reviews)</span>
                  </div>
                )}

                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-slate-950 font-display tabular-nums">
                    {formatUGX(product.price)}
                  </span>
                  {product.previousPrice && product.previousPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      {formatUGX(product.previousPrice)}
                    </span>
                  )}
                </div>

                {/* Stock status */}
                <div className="mt-2 text-xs">
                  {isOutOfStock ? (
                    <span className="text-rose-600 font-bold">Currently Out of Stock</span>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Available in stock ({product.stock} units at Kikoni Hub)
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Delivery Location Pre-select */}
                <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-600" />
                    <span>Your Hall / Hostel for Express Drop-off:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                    <select
                      value={selectedHall}
                      onChange={(e) => setSelectedHall(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      {ALL_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name} {loc.isFreeDelivery ? '(Free)' : ''}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Room # or Block (optional)"
                      value={customRoom}
                      onChange={(e) => setCustomRoom(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mt-5 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="p-2 hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-slate-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock || isOutOfStock}
                      className="p-2 hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 tabular-nums font-semibold">
                    Total: {formatUGX(product.price * quantity)}
                  </span>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="py-3 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4 text-sky-400" />
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="py-3 px-4 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>BUY NOW</span>
                  </button>
                </div>

                {/* Direct WhatsApp Ordering */}
                <button
                  onClick={handleDirectWhatsAppOrder}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ORDER VIA WHATSAPP NOW</span>
                </button>
              </div>

            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 mb-3">Technical Specifications</h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                <table className="w-full text-xs text-left">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr 
                        key={i} 
                        className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/70 border-t border-slate-200'}
                      >
                        <td className="py-2.5 px-4 font-semibold text-slate-700 w-1/3">{spec.key}</td>
                        <td className="py-2.5 px-4 text-slate-600">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Tested & verified before delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>No delivery fees for Makerere campus</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
