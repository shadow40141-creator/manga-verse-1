import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_DEMO_ORDERS, INITIAL_MANGA_CATALOG } from '../data/mangaCatalog';
import {
  CartItem,
  CustomerDetails,
  MangaProduct,
  MangaReview,
  Order,
  OrderStatus,
  PageRoute,
  ToastMessage,
} from '../types/manga';
import {
  loadCart,
  loadOrders,
  loadPreferences,
  loadProducts,
  loadWishlist,
  saveCart,
  saveOrders,
  savePreferences,
  saveProducts,
  saveWishlist,
  UserPreferences,
} from '../utils/storage';

interface DetailedCartItem {
  product: MangaProduct;
  quantity: number;
}

interface StoreContextValue {
  route: PageRoute;
  selectedProductId: string | null;
  selectedProduct: MangaProduct | null;
  seriesFilter: string;
  setSeriesFilter: (series: string) => void;
  navigate: (
    route: PageRoute,
    options?: { productId?: string; seriesFilter?: string }
  ) => void;
  products: MangaProduct[];
  cart: CartItem[];
  cartDetailed: DetailedCartItem[];
  cartCount: number;
  cartSubtotal: number;
  wishlist: string[];
  wishlistProducts: MangaProduct[];
  orders: Order[];
  preferences: UserPreferences;
  dismissPromoBanner: () => void;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addReview: (productId: string, review: Omit<MangaReview, 'id' | 'date'>) => void;
  placeOrder: (
    customer: CustomerDetails,
    paymentMethod: 'Cash on Delivery' | 'WhatsApp Express Order',
    promoDiscount: number
  ) => Order;
  addProduct: (product: Omit<MangaProduct, 'id' | 'reviews' | 'reviewCount' | 'salesCount'>) => void;
  updateProduct: (id: string, updates: Partial<MangaProduct>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  resetDemoCatalog: () => void;
  toasts: ToastMessage[];
  notify: (title: string, description?: string, variant?: ToastMessage['variant']) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<MangaProduct[]>(() => loadProducts());
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [wishlist, setWishlist] = useState<string[]>(() => loadWishlist());
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferences());
  const [seriesFilter, setSeriesFilterState] = useState<string>(() => preferences.lastSeriesFilter || 'All');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    saveWishlist(wishlist);
  }, [wishlist]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const notify = (
    title: string,
    description?: string,
    variant: ToastMessage['variant'] = 'success'
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { id, title, description, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setSeriesFilter = (series: string) => {
    setSeriesFilterState(series);
    setPreferences((prev) => ({ ...prev, lastSeriesFilter: series }));
  };

  const dismissPromoBanner = () => {
    setPreferences((prev) => ({ ...prev, promoBannerDismissed: true }));
  };

  const navigate = (
    nextRoute: PageRoute,
    options?: { productId?: string; seriesFilter?: string }
  ) => {
    if (options?.productId) {
      setSelectedProductId(options.productId);
    }
    if (options?.seriesFilter !== undefined) {
      setSeriesFilter(options.seriesFilter);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return products[0] ?? null;
    return products.find((p) => p.id === selectedProductId) ?? products[0] ?? null;
  }, [products, selectedProductId]);

  const cartDetailed = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter((entry): entry is DetailedCartItem => entry !== null);
  }, [cart, products]);

  const cartCount = useMemo(
    () => cartDetailed.reduce((sum, item) => sum + item.quantity, 0),
    [cartDetailed]
  );

  const cartSubtotal = useMemo(
    () => cartDetailed.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartDetailed]
  );

  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlist.includes(p.id)),
    [products, wishlist]
  );

  const addToCart = (productId: string, quantity = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    if (product.stock <= 0) {
      notify('Out of stock', `${product.title} is currently sold out.`, 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((i) => (i.productId === productId ? { ...i, quantity: nextQty } : i));
      }
      return [...prev, { productId, quantity: Math.min(product.stock, quantity) }];
    });
    notify('Added to Cart', `${product.title} (Vol. ${String(product.volume).padStart(2, '0')})`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
    notify('Removed from Cart', undefined, 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const clamped = Math.min(product.stock, quantity);
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: clamped } : i))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        notify('Removed from Wishlist', product?.title, 'info');
        return prev.filter((id) => id !== productId);
      }
      notify('Saved to Wishlist', product?.title);
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addReview = (productId: string, review: Omit<MangaReview, 'id' | 'date'>) => {
    const newReview: MangaReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedReviews = [newReview, ...p.reviews];
        const newCount = p.reviewCount + 1;
        const nextRating = Number(
          (((p.rating * p.reviewCount) + review.rating) / newCount).toFixed(1)
        );
        return {
          ...p,
          reviews: updatedReviews,
          reviewCount: newCount,
          rating: nextRating,
        };
      })
    );
    notify('Review Published', 'Thank you for sharing your rating.');
  };

  const placeOrder = (
    customer: CustomerDetails,
    paymentMethod: 'Cash on Delivery' | 'WhatsApp Express Order',
    promoDiscount: number
  ): Order => {
    const subtotal = cartSubtotal;
    const shipping = subtotal >= 60 || subtotal === 0 ? 0 : 4.99;
    const total = Math.max(0, subtotal - promoDiscount + shipping);

    const newOrder: Order = {
      id: `KM-${Math.floor(1044 + Math.random() * 8900)}`,
      createdAt: new Date().toISOString(),
      customer,
      items: cartDetailed.map(({ product, quantity }) => ({
        productId: product.id,
        title: product.title,
        series: product.series,
        volume: product.volume,
        price: product.price,
        quantity,
      })),
      subtotal,
      discount: promoDiscount,
      shipping,
      total,
      paymentMethod,
      status: 'Pending',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Decrement product stock and increment salesCount
    setProducts((prev) =>
      prev.map((p) => {
        const bought = cart.find((c) => c.productId === p.id);
        if (!bought) return p;
        return {
          ...p,
          stock: Math.max(0, p.stock - bought.quantity),
          salesCount: p.salesCount + bought.quantity,
        };
      })
    );

    clearCart();
    notify('Order Confirmed', `Order ${newOrder.id} has been placed.`);
    return newOrder;
  };

  const addProduct = (
    productData: Omit<MangaProduct, 'id' | 'reviews' | 'reviewCount' | 'salesCount'>
  ) => {
    const newProduct: MangaProduct = {
      ...productData,
      id: `${productData.series.toLowerCase().replace(/\s+/g, '-')}-vol-${productData.volume}-${Date.now()
        .toString()
        .slice(-4)}`,
      reviews: [],
      reviewCount: 0,
      salesCount: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
    notify('Manga Added', `${newProduct.title} is now live in the store.`);
  };

  const updateProduct = (id: string, updates: Partial<MangaProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    notify('Catalog Updated', 'Changes saved to LocalStorage.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.productId !== id));
    setWishlist((prev) => prev.filter((w) => w !== id));
    notify('Product Deleted', undefined, 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    notify('Order Status Updated', `${orderId} marked as ${status}.`);
  };

  const resetDemoCatalog = () => {
    setProducts(INITIAL_MANGA_CATALOG);
    setOrders(INITIAL_DEMO_ORDERS);
    notify('Demo Data Restored', 'Default catalog and sample orders loaded.');
  };

  return (
    <StoreContext.Provider
      value={{
        route,
        selectedProductId,
        selectedProduct,
        seriesFilter,
        setSeriesFilter,
        navigate,
        products,
        cart,
        cartDetailed,
        cartCount,
        cartSubtotal,
        wishlist,
        wishlistProducts,
        orders,
        preferences,
        dismissPromoBanner,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        addReview,
        placeOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        resetDemoCatalog,
        toasts,
        notify,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
