import { MangaProduct } from '../types/manga';

export const STORE_WHATSAPP_DISPLAY = '+99999999999';
export const STORE_WHATSAPP_RAW = '99999999999';

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${STORE_WHATSAPP_RAW}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppLink(product: MangaProduct, quantity = 1): string {
  const total = (product.price * quantity).toFixed(2);
  const message = [
    `Hello Anime World! I would like to order:`,
    `• Title: ${product.title} (Vol. ${String(product.volume).padStart(2, '0')})`,
    `• Series: ${product.series}`,
    `• Quantity: ${quantity}`,
    `• Unit Price: $${product.price.toFixed(2)}`,
    `• Estimated Total: $${total}`,
    `Please confirm availability and Cash on Delivery options.`,
  ].join('\n');

  return buildWhatsAppLink(message);
}

export function buildCartWhatsAppLink(
  items: Array<{ product: MangaProduct; quantity: number }>,
  total: number
): string {
  const lines = items.map(
    ({ product, quantity }) =>
      `• ${product.title} (Vol. ${String(product.volume).padStart(2, '0')}) x${quantity} — $${(
        product.price * quantity
      ).toFixed(2)}`
  );

  const message = [
    `Hello Anime World! I would like to place an order from my cart:`,
    ...lines,
    `Total (incl. shipping/discounts): $${total.toFixed(2)}`,
    `Please let me know the next steps.`,
  ].join('\n');

  return buildWhatsAppLink(message);
}

export function buildGeneralWhatsAppLink(): string {
  return buildWhatsAppLink(
    'Hello Anime World! I have a question about a manga volume or order.'
  );
}
