export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number; // in UGX
  previousPrice?: number; // in UGX
  discountPercentage?: number;
  images: string[];
  stock: number;
  specifications: { key: string; value: string }[];
  featured: boolean;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  itemCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryDetails {
  zoneType: 'hall' | 'hostel' | 'kikoni' | 'kikumi' | 'other';
  locationName: string; // e.g. "Mitchell Hall" or "Olympia Hostel"
  roomOrBlock: string; // e.g. "Block B Room 14"
  landmark?: string;
  instructions?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
}

export type PaymentMethod = 'cod' | 'mobile_money';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. MGH-001042
  customerId?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryDetails: DeliveryDetails;
  paymentMethod: PaymentMethod;
  paymentProvider?: 'mtn' | 'airtel';
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  primaryLocation: string;
}

export interface BusinessSettings {
  businessName: string;
  motto: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  businessHours: string;
  freeDeliveryNote: string;
  standardDeliveryFee: number; // For non-free locations (UGX)
  freeDeliveryLocations: string[]; // List of halls & hostels
  socialLinks: {
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  lowStockThreshold: number;
}
