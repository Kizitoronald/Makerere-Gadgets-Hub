import { CartItem, DeliveryDetails, CustomerInfo, Product } from '../types';
import { formatUGX } from './currency';

/**
 * Format a phone number for WhatsApp URL (digits only, e.g. 256700000000)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Strip non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0 (Ugandan local format e.g. 0701234567), replace with 256
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '256' + cleaned.slice(1);
  }
  
  // If missing country code and 9 digits
  if (cleaned.length === 9) {
    cleaned = '256' + cleaned;
  }
  
  return cleaned || '256740553369';
}

/**
 * Generate WhatsApp checkout/order placement URL
 */
export function generateWhatsAppOrderUrl(params: {
  businessPhone: string;
  items: CartItem[] | { name: string; price: number; quantity: number }[];
  customer?: CustomerInfo;
  delivery?: DeliveryDetails;
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderNumber?: string;
}): string {
  const { businessPhone, items, customer, delivery, subtotal, deliveryFee, total, orderNumber } = params;

  let message = `Hello Makerere Gadgets Hub, I would like to place an order.`;
  if (orderNumber) {
    message += `\nOrder Ref: *${orderNumber}*`;
  }
  
  message += `\n\n*Products:*`;
  items.forEach((item, index) => {
    const name = 'product' in item ? item.product.name : item.name;
    const price = 'product' in item ? item.product.price : item.price;
    const qty = item.quantity;
    message += `\n${index + 1}. ${name} × ${qty} — ${formatUGX(price * qty)}`;
  });

  message += `\n\nSubtotal: ${formatUGX(subtotal)}`;
  if (deliveryFee === 0) {
    message += `\nDelivery: *FREE (Makerere Campus)*`;
  } else {
    message += `\nDelivery: ${formatUGX(deliveryFee)}`;
  }
  message += `\n*Total: ${formatUGX(total)}*`;

  if (customer && customer.name) {
    message += `\n\n*Customer Details:*`;
    message += `\nName: ${customer.name}`;
    message += `\nPhone: ${customer.phone}`;
    if (customer.whatsapp && customer.whatsapp !== customer.phone) {
      message += `\nWhatsApp: ${customer.whatsapp}`;
    }
  }

  if (delivery && delivery.locationName) {
    message += `\n\n*Delivery Location:*`;
    message += `\nHall/Hostel/Area: ${delivery.locationName}`;
    if (delivery.roomOrBlock) {
      message += `\nRoom/Block: ${delivery.roomOrBlock}`;
    }
    if (delivery.landmark) {
      message += `\nLandmark: ${delivery.landmark}`;
    }
    if (delivery.instructions) {
      message += `\nInstructions: ${delivery.instructions}`;
    }
  }

  message += `\n\nThank you!`;

  const cleanPhone = formatPhoneForWhatsApp(businessPhone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp inquiry for a single product
 */
export function generateWhatsAppProductInquiryUrl(params: {
  businessPhone: string;
  product: Product;
  customerLocation?: string;
}): string {
  const { businessPhone, product, customerLocation } = params;
  let message = `Hello Makerere Gadgets Hub!\nI am interested in ordering:\n\n*${product.name}*\nPrice: ${formatUGX(product.price)}`;
  
  if (customerLocation) {
    message += `\nDelivery to: ${customerLocation}`;
  } else {
    message += `\nIs this in stock for delivery to Makerere today?`;
  }
  
  message += `\n\nThank you!`;
  const cleanPhone = formatPhoneForWhatsApp(businessPhone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Direct general chat link
 */
export function generateWhatsAppChatUrl(businessPhone: string, text?: string): string {
  const cleanPhone = formatPhoneForWhatsApp(businessPhone);
  const defaultText = text || 'Hello Makerere Gadgets Hub, I have an inquiry about your gadgets and delivery around Makerere.';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultText)}`;
}
