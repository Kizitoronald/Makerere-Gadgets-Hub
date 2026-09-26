import { Product, Category, Order, OrderStatus, BusinessSettings, CustomerRecord } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BUSINESS_SETTINGS } from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'mgh_products_v1',
  CATEGORIES: 'mgh_categories_v1',
  ORDERS: 'mgh_orders_v1',
  CUSTOMERS: 'mgh_customers_v1',
  SETTINGS: 'mgh_settings_v1',
  ORDER_COUNTER: 'mgh_order_counter_v1',
};

// Custom event to trigger re-renders across tabs or components
const triggerUpdate = (type: string) => {
  window.dispatchEvent(new CustomEvent('mgh_db_update', { detail: { type } }));
};

// Initialise DB with seed data if empty
export function initDatabase() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_BUSINESS_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDER_COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.ORDER_COUNTER, '1040');
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    // Seed with a couple of realistic recent student orders so the admin dashboard has real statistics right away!
    const sampleOrders: Order[] = [
      {
        id: 'ord-seed-1',
        orderNumber: 'MGH-001038',
        customer: {
          name: 'Mukisa Brian',
          phone: '0772123456',
          whatsapp: '0772123456',
          email: 'brian.m@gmail.com'
        },
        items: [
          { productId: 'prod-65w-charger', name: '65W Fast Charger (GaN Dual Type-C + USB)', price: 26000, quantity: 1, image: '/src/assets/images/product_fast_charger_1790413162955.jpg' },
          { productId: 'prod-f9-earbuds', name: 'Air F9 Pro+ TWS Earbuds with Power Display', price: 22000, quantity: 1, image: '/src/assets/images/product_air_earbuds_1790413175130.jpg' }
        ],
        subtotal: 48000,
        deliveryFee: 0,
        total: 48000,
        deliveryDetails: {
          zoneType: 'hall',
          locationName: 'Mitchell Hall',
          roomOrBlock: 'Block A, Room 22',
          landmark: 'Near the Mitchell dining quad',
          instructions: 'Call when you reach the main stairs'
        },
        paymentMethod: 'cod',
        status: 'delivered',
        statusHistory: [
          { status: 'pending', timestamp: '2026-03-24T14:10:00Z', note: 'Order placed by customer' },
          { status: 'confirmed', timestamp: '2026-03-24T14:15:00Z', note: 'Confirmed with student via phone' },
          { status: 'out_for_delivery', timestamp: '2026-03-24T14:35:00Z', note: 'Rider dispatched to Mitchell' },
          { status: 'delivered', timestamp: '2026-03-24T14:50:00Z', note: 'Delivered and cash received' }
        ],
        createdAt: '2026-03-24T14:10:00Z',
        updatedAt: '2026-03-24T14:50:00Z'
      },
      {
        id: 'ord-seed-2',
        orderNumber: 'MGH-001039',
        customer: {
          name: 'Nalubega Patricia',
          phone: '0703987654',
          whatsapp: '0703987654',
          email: 'patricia.n@gmail.com'
        },
        items: [
          { productId: 'prod-6way-extension', name: '6-Way Heavy Duty Extension Cable with Individual Switches', price: 45000, quantity: 1, image: '/src/assets/images/product_extension_cable_1790413185846.jpg' },
          { productId: 'prod-single-hotplate', name: 'Single Electric Spiral Coil Hot Plate (1000W)', price: 25000, quantity: 1, image: '/src/assets/images/product_single_hotplate_1790413196853.jpg' }
        ],
        subtotal: 70000,
        deliveryFee: 0,
        total: 70000,
        deliveryDetails: {
          zoneType: 'hostel',
          locationName: 'Olympia Hostel',
          roomOrBlock: 'Room 304, 3rd Floor',
          landmark: 'Kikoni, opposite supermarket',
          instructions: 'Call security gate or dial my number'
        },
        paymentMethod: 'mobile_money',
        paymentProvider: 'mtn',
        status: 'out_for_delivery',
        statusHistory: [
          { status: 'pending', timestamp: '2026-03-25T11:00:00Z', note: 'Order placed' },
          { status: 'confirmed', timestamp: '2026-03-25T11:10:00Z', note: 'Confirmed with Olympia student' },
          { status: 'processing', timestamp: '2026-03-25T11:15:00Z', note: 'Items packed and tested' },
          { status: 'out_for_delivery', timestamp: '2026-03-25T11:30:00Z', note: 'Boda rider heading to Olympia' }
        ],
        createdAt: '2026-03-25T11:00:00Z',
        updatedAt: '2026-03-25T11:30:00Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleOrders));
  }
}

// ---------------- PRODUCTS ----------------

export function getProducts(): Product[] {
  initDatabase();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find(p => p.slug === slug);
}

export function saveProduct(product: Product): Product {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  const now = new Date().toISOString();

  let updatedProduct: Product;
  if (index >= 0) {
    updatedProduct = { ...product, updatedAt: now };
    products[index] = updatedProduct;
  } else {
    updatedProduct = {
      ...product,
      id: product.id || `prod-${Date.now()}`,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      createdAt: now,
      updatedAt: now
    };
    products.unshift(updatedProduct);
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  triggerUpdate('products');
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length !== products.length) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    triggerUpdate('products');
    return true;
  }
  return false;
}

// ---------------- CATEGORIES ----------------

export function getCategories(): Category[] {
  initDatabase();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const categories: Category[] = raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
    
    // Compute dynamic item counts from current products
    const products = getProducts();
    return categories.map(cat => ({
      ...cat,
      itemCount: products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length
    }));
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function saveCategory(category: Category): Category {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === category.id);
  
  if (index >= 0) {
    categories[index] = category;
  } else {
    const newCat = {
      ...category,
      id: category.id || `cat-${Date.now()}`,
      slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    categories.push(newCat);
  }

  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  triggerUpdate('categories');
  return category;
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  if (filtered.length !== categories.length) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    triggerUpdate('categories');
    return true;
  }
  return false;
}

// ---------------- ORDERS ----------------

export function getOrders(): Order[] {
  initDatabase();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find(o => o.id === id);
}

export function getOrderByNumberAndPhone(orderNumber: string, phone: string): Order | undefined {
  const cleanedSearchNum = orderNumber.trim().toUpperCase();
  const cleanedSearchPhone = phone.replace(/\D/g, '');

  return getOrders().find(o => {
    const matchNum = o.orderNumber.toUpperCase() === cleanedSearchNum;
    const orderPhone = o.customer.phone.replace(/\D/g, '');
    const matchPhone = orderPhone.includes(cleanedSearchPhone) || cleanedSearchPhone.includes(orderPhone);
    return matchNum && matchPhone;
  });
}

export function createOrder(data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Order {
  const orders = getOrders();
  
  // Increment order counter
  let currentCounter = parseInt(localStorage.getItem(STORAGE_KEYS.ORDER_COUNTER) || '1040', 10);
  currentCounter += 1;
  localStorage.setItem(STORAGE_KEYS.ORDER_COUNTER, currentCounter.toString());

  const orderNumber = `MGH-${currentCounter.toString().padStart(6, '0')}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...data,
    id: `ord-${Date.now()}`,
    orderNumber,
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        status: data.status || 'pending',
        timestamp: now,
        note: 'Order submitted online by customer'
      }
    ]
  };

  orders.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  // Deduct product stock
  const products = getProducts();
  newOrder.items.forEach(item => {
    const p = products.find(prod => prod.id === item.productId);
    if (p && p.stock !== undefined) {
      p.stock = Math.max(0, p.stock - item.quantity);
      if (p.stock === 0) p.inStock = false;
    }
  });
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

  triggerUpdate('orders');
  triggerUpdate('products');
  return newOrder;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order | null {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const order = orders[index];

  order.status = newStatus;
  order.updatedAt = now;
  order.statusHistory.push({
    status: newStatus,
    timestamp: now,
    note: note || `Status updated to ${newStatus.replace(/_/g, ' ')}`
  });

  orders[index] = order;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  triggerUpdate('orders');
  return order;
}

// ---------------- CUSTOMERS ----------------

export function getCustomers(): CustomerRecord[] {
  const orders = getOrders();
  const customerMap = new Map<string, CustomerRecord>();

  orders.forEach(order => {
    const key = order.customer.phone.replace(/\D/g, '') || order.customer.name.toLowerCase();
    const existing = customerMap.get(key);

    if (existing) {
      existing.totalSpent += order.total;
      existing.ordersCount += 1;
      if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.createdAt;
        existing.primaryLocation = order.deliveryDetails.locationName;
      }
    } else {
      customerMap.set(key, {
        id: `cust-${key}`,
        name: order.customer.name,
        phone: order.customer.phone,
        whatsapp: order.customer.whatsapp || order.customer.phone,
        email: order.customer.email,
        totalSpent: order.total,
        ordersCount: 1,
        lastOrderDate: order.createdAt,
        primaryLocation: order.deliveryDetails.locationName
      });
    }
  });

  return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

// ---------------- SETTINGS ----------------

export function getBusinessSettings(): BusinessSettings {
  initDatabase();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return INITIAL_BUSINESS_SETTINGS;
    const parsed = JSON.parse(raw);
    // If settings still hold older placeholder number or wrong digits, update to Kizito Ronald's exact number
    const cleanedNumber = (parsed.whatsapp || '').replace(/\D/g, '');
    if (!parsed.whatsapp || cleanedNumber !== '256740553369' && cleanedNumber !== '0740553369') {
      const synced = {
        ...parsed,
        phone: '+256 740 553369',
        whatsapp: '+256 740 553369',
        email: parsed.email || 'kizitoronaldisgood@gmail.com',
        socialLinks: {
          ...parsed.socialLinks,
          whatsapp: 'https://wa.me/256740553369',
        }
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(synced));
      return synced;
    }
    return parsed;
  } catch {
    return INITIAL_BUSINESS_SETTINGS;
  }
}

export function updateBusinessSettings(settings: Partial<BusinessSettings>): BusinessSettings {
  const current = getBusinessSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  triggerUpdate('settings');
  return updated;
}

// ---------------- RESET TO DEFAULTS ----------------

export function resetDatabaseToDefaults() {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_BUSINESS_SETTINGS));
  localStorage.removeItem(STORAGE_KEYS.ORDERS);
  localStorage.removeItem(STORAGE_KEYS.ORDER_COUNTER);
  initDatabase();
  triggerUpdate('all');
}
