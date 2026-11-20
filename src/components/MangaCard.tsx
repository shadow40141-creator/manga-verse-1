import { Heart, MessageCircle, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MangaProduct } from '../types/manga';
import { buildProductWhatsAppLink } from '../utils/whatsapp';
import { MangaCover } from './MangaCover';

interface MangaCardProps {
  product: MangaProduct;
}

export function MangaCard({ product }: MangaCardProps) {
  const { navigate, addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);
  const outOfStock = product.stock <= 0;
  const discountPct =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-[#121217] transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/50">
      {/* Clickable Cover Visual */}
      <div className="relative">
        <button
          type="button"
          onClick={() => navigate('details', { productId: product.id })}
          className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          aria-label={`View details for ${product.title}`}
        >
          <MangaCover
            src={product.coverImage}
            alt={`${product.title} manga cover`}
            series={product.series}
            japaneseTitle={product.japaneseTitle}
            volume={product.volume}
            spineColor={product.spineColor}
          />
        </button>

        {/* Wishlist Action on Top Right */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg border backdrop-blur-md transition-colors ${
            wishlisted
              ? 'border-rose-500/70 bg-rose-600 text-white'
              : 'border-white/15 bg-black/60 text-zinc-200 hover:border-rose-400/60 hover:text-rose-300'
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Unboxed Clean Metadata */}
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
            <span className="truncate">
              {product.author} · Vol. {String(product.volume).padStart(2, '0')}
            </span>
            <span className="inline-flex items-center gap-1 shrink-0 text-amber-400 font-mono-num">
              <Star className="h-3 w-3 fill-amber-400" />
              {product.rating.toFixed(1)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('details', { productId: product.id })}
            className="mt-1.5 block w-full text-left"
          >
            <h3 className="font-display text-base font-semibold text-zinc-100 group-hover:text-rose-400 transition-colors line-clamp-1">
              {product.title}
            </h3>
          </button>

          <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing + Actions */}
        <div className="mt-4 pt-3 border-t border-zinc-800/70">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono-num text-base font-semibold text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-mono-num text-xs text-zinc-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-400">
              {outOfStock ? (
                <span className="text-rose-400 font-medium">Out of Stock</span>
              ) : discountPct > 0 ? (
                <span className="text-rose-400 font-mono-num font-medium">-{discountPct}%</span>
              ) : (
                <span>In Stock</span>
              )}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={outOfStock}
              onClick={() => addToCart(product.id, 1)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors whitespace-nowrap"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>{outOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            </button>

            <a
              href={buildProductWhatsAppLink(product, 1)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-200 hover:border-emerald-500/60 hover:text-emerald-300 transition-colors whitespace-nowrap"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
