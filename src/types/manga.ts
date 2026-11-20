export type MangaSeries =
  | 'Jujutsu Kaisen'
  | 'Demon Slayer'
  | 'Death Note'
  | 'Attack on Titan'
  | 'One Piece'
  | 'Naruto'
  | 'Dragon Ball'
  | 'Tokyo Revengers'
  | 'Chainsaw Man'
  | 'Solo Leveling'
  | 'Bleach'
  | 'Hunter x Hunter'
  | 'My Hero Academia';

export type PageRoute =
  | 'home'
  | 'shop'
  | 'details'
  | 'cart'
  | 'wishlist'
  | 'checkout'
  | 'about'
  | 'contact'
  | 'admin';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface MangaReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MangaProduct {
  id: string;
  title: string;
  japaneseTitle: string;
  series: MangaSeries;
  volume: number;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  stock: number;
  releaseYear: number;
  pages: number;
  publisher: string;
  coverImage: string;
  spineColor: string;
  description: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  reviews: MangaReview[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  title: string;
  series: string;
  volume: number;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  items: OrderItemSnapshot[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'WhatsApp Express Order';
  status: OrderStatus;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'info' | 'error';
}
