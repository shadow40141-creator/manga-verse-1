import { INITIAL_DEMO_ORDERS, INITIAL_MANGA_CATALOG } from '../data/mangaCatalog';
import { CartItem, MangaProduct, Order } from '../types/manga';

const KEYS = {
  PRODUCTS: 'animeworld_products_v5',
  CART: 'animeworld_cart_v1',
  WISHLIST: 'animeworld_wishlist_v1',
  ORDERS: 'animeworld_orders_v1',
  PREFS: 'animeworld_prefs_v1',
};

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export function loadProducts(): MangaProduct[] {
  try {
    window.localStorage.removeItem('kurogane_products_v1');
    window.localStorage.removeItem('kurogane_products_v2');
    window.localStorage.removeItem('kurogane_products_v3');
    window.localStorage.removeItem('animeworld_products_v4');
  } catch {
    // Ignore storage errors
  }
  const stored = safeRead<MangaProduct[] | null>(KEYS.PRODUCTS, null);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  safeWrite(KEYS.PRODUCTS, INITIAL_MANGA_CATALOG);
  return INITIAL_MANGA_CATALOG;
}

export function saveProducts(products: MangaProduct[]): void {
  safeWrite(KEYS.PRODUCTS, products);
}

export function loadCart(): CartItem[] {
  return safeRead<CartItem[]>(KEYS.CART, []);
}

export function saveCart(cart: CartItem[]): void {
  safeWrite(KEYS.CART, cart);
}

export function loadWishlist(): string[] {
  return safeRead<string[]>(KEYS.WISHLIST, []);
}

export function saveWishlist(wishlist: string[]): void {
  safeWrite(KEYS.WISHLIST, wishlist);
}

export function loadOrders(): Order[] {
  const stored = safeRead<Order[] | null>(KEYS.ORDERS, null);
  if (stored && Array.isArray(stored)) {
    return stored;
  }
  safeWrite(KEYS.ORDERS, INITIAL_DEMO_ORDERS);
  return INITIAL_DEMO_ORDERS;
}

export function saveOrders(orders: Order[]): void {
  safeWrite(KEYS.ORDERS, orders);
}

export interface UserPreferences {
  lastSeriesFilter: string;
  lastSort: string;
  promoBannerDismissed: boolean;
}

export function loadPreferences(): UserPreferences {
  return safeRead<UserPreferences>(KEYS.PREFS, {
    lastSeriesFilter: 'All',
    lastSort: 'featured',
    promoBannerDismissed: false,
  });
}

export function savePreferences(prefs: UserPreferences): void {
  safeWrite(KEYS.PREFS, prefs);
}
