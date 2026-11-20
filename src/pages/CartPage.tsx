import { ArrowRight, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { MangaCover } from '../components/MangaCover';
import { useStore } from '../context/StoreContext';
import { buildCartWhatsAppLink } from '../utils/whatsapp';

export function CartPage() {
  const {
    cartDetailed,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    navigate,
    notify,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const discount = promoApplied ? Number((cartSubtotal * 0.1).toFixed(2)) : 0;
  const discountedSubtotal = Math.max(0, cartSubtotal - discount);
  const shipping = discountedSubtotal >= 60 || discountedSubtotal === 0 ? 0 : 4.99;
  const total = discountedSubtotal + shipping;
  const freeShippingRemaining = Math.max(0, 60 - discountedSubtotal);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'ANIMEWORLD10' || code === 'KUROGANE10') {
      setPromoApplied(true);
      notify('Promo Code Applied', '10% collector discount unlocked.');
    } else {
      notify('Invalid Promo Code', 'Try code ANIMEWORLD10 for 10% off.', 'error');
    }
  };

  if (cartDetailed.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-[#121217] text-zinc-400">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-white">Your Shopping Cart is Empty</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Add manga volumes from Jujutsu Kaisen, Demon Slayer, Solo Leveling, or One Piece to get
          started.
        </p>
        <button
          type="button"
          onClick={() => navigate('shop')}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
        >
          <span>Browse Manga Store</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-800/80 pb-5">
        <h1 className="font-display text-3xl font-bold text-white">Shopping Cart</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {freeShippingRemaining > 0 ? (
            <>
              Add <span className="font-mono-num text-white">${freeShippingRemaining.toFixed(2)}</span>{' '}
              more for free express shipping.
            </>
          ) : (
            <span className="text-emerald-400">You unlocked Free Express Shipping.</span>
          )}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cartDetailed.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-[#121217] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4 min-w-0">
                <button
                  type="button"
                  onClick={() => navigate('details', { productId: product.id })}
                  className="w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-800"
                >
                  <MangaCover
                    src={product.coverImage}
                    alt={product.title}
                    series={product.series}
                    volume={product.volume}
                    spineColor={product.spineColor}
                  />
                </button>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-400">
                    {product.series} · Vol. {String(product.volume).padStart(2, '0')}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('details', { productId: product.id })}
                    className="mt-0.5 text-left font-display text-base font-semibold text-white hover:text-rose-400 transition-colors truncate block max-w-full"
                  >
                    {product.title}
                  </button>
                  <p className="mt-1 font-mono-num text-sm text-zinc-300">
                    ${product.price.toFixed(2)} each
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="flex items-center rounded-lg border border-zinc-700 bg-zinc-950">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(product.id, quantity - 1)}
                    aria-label="Decrease quantity"
                    className="p-2 text-zinc-300 hover:text-white"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono-num text-xs font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(product.id, quantity + 1)}
                    aria-label="Increase quantity"
                    className="p-2 text-zinc-300 hover:text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <span className="w-20 text-right font-mono-num text-sm font-semibold text-white">
                  ${(product.price * quantity).toFixed(2)}
                </span>

                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  aria-label={`Remove ${product.title}`}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-zinc-800 bg-[#121217] p-6 space-y-5 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold text-white">Order Summary</h2>

            {/* Promo Code */}
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code (ANIMEWORLD10)"
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                Apply
              </button>
            </div>

            <div className="space-y-2.5 border-t border-zinc-800 pt-4 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono-num text-zinc-200">${cartSubtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo (10%)</span>
                  <span className="font-mono-num">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span className="font-mono-num text-zinc-200">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-3 text-base font-semibold text-white">
                <span>Total</span>
                <span className="font-mono-num">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('checkout')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href={buildCartWhatsAppLink(cartDetailed, total)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-5 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-900/40 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Order Cart via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
