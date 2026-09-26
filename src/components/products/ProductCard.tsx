import React from 'react';
import { ShoppingCart, Star, MessageSquare, Zap } from 'lucide-react';
import { Product } from '../../types';
import { formatUGX, calculateDiscount } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useToast } from '../common/Toast';
import { generateWhatsAppProductInquiryUrl } from '../../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  whatsappPhone: string;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  whatsappPhone,
  onSelectProduct,
  onBuyNow,
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const discount = product.discountPercentage || calculateDiscount(product.price, product.previousPrice);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    showToast(`Added "${product.name}" to cart`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onBuyNow(product);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateWhatsAppProductInquiryUrl({
      businessPhone: whatsappPhone,
      product,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const mainImage = product.images?.[0] || '/src/assets/images/hero_gadgets_showcase_1790413151406.jpg';

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Visual Header / Image Container */}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Styled graceful fallback if image fails
            (e.target as HTMLImageElement).src = '/src/assets/images/hero_gadgets_showcase_1790413151406.jpg';
          }}
        />

        {/* Discount & Stock Badges (quiet unboxed tags compliant with zero-pill rule) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {discount > 0 && (
            <span className="bg-red-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded shadow-sm">
              {discount}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-slate-900 text-sky-400 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              POPULAR
            </span>
          )}
        </div>

        {/* Quick WhatsApp Inquiry overlay on hover */}
        <button
          onClick={handleWhatsApp}
          title="Inquire on WhatsApp"
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-emerald-600 hover:text-white text-emerald-700 shadow-sm transition-colors opacity-90 sm:opacity-0 group-hover:opacity-100"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-slate-600 uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-amber-500 text-[11px] font-semibold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-slate-400">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors">
            {product.name}
          </h3>

          {/* Pricing Section (Tabular figures, UGX formatted) */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-slate-950 font-display tabular-nums">
              {formatUGX(product.price)}
            </span>
            {product.previousPrice && product.previousPrice > product.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {formatUGX(product.previousPrice)}
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className="mt-2 text-[11px]">
            {isOutOfStock ? (
              <span className="text-rose-600 font-semibold">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Only {product.stock} units left!
              </span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                In Stock (Free Hall Delivery)
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: ADD TO CART & BUY NOW */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 active:scale-[0.98]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>ADD TO CART</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 active:scale-[0.98]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
