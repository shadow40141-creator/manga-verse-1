import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { MangaCard } from '../components/MangaCard';
import { MangaCover } from '../components/MangaCover';
import { useStore } from '../context/StoreContext';
import { buildProductWhatsAppLink } from '../utils/whatsapp';

export function MangaDetailsPage() {
  const {
    selectedProduct,
    products,
    navigate,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addReview,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products
      .filter((p) => p.id !== selectedProduct.id)
      .sort((a, b) => {
        const aSame = a.series === selectedProduct.series ? 1 : 0;
        const bSame = b.series === selectedProduct.series ? 1 : 0;
        return bSame - aSame || b.salesCount - a.salesCount;
      })
      .slice(0, 4);
  }, [products, selectedProduct]);

  if (!selectedProduct) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-zinc-400">Manga volume not found.</p>
        <button
          type="button"
          onClick={() => navigate('shop')}
          className="mt-4 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const wishlisted = isInWishlist(selectedProduct.id);
  const outOfStock = selectedProduct.stock <= 0;
  const discountPct =
    selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price
      ? Math.round(
          ((selectedProduct.originalPrice - selectedProduct.price) /
            selectedProduct.originalPrice) *
            100
        )
      : 0;

  const handleBuyNow = () => {
    addToCart(selectedProduct.id, quantity);
    navigate('checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;
    addReview(selectedProduct.id, {
      author: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate('shop')}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Manga Catalog</span>
      </button>

      {/* Contiguous Purchase Module */}
      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
        {/* Left: Cover Art */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#121217] p-4">
            <MangaCover
              src={selectedProduct.coverImage}
              alt={`${selectedProduct.title} cover`}
              series={selectedProduct.series}
              japaneseTitle={selectedProduct.japaneseTitle}
              volume={selectedProduct.volume}
              spineColor={selectedProduct.spineColor}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Right: Purchase & Spec Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span>{selectedProduct.series}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">
                Volume {String(selectedProduct.volume).padStart(2, '0')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{selectedProduct.publisher}</span>
            </div>

            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {selectedProduct.title}
            </h1>

            <p className="mt-2 text-sm text-zinc-300">
              By <span className="font-semibold text-white">{selectedProduct.author}</span> ·{' '}
              <span className="font-mono-num text-zinc-400">{selectedProduct.pages} pages</span> ·{' '}
              <span className="font-mono-num text-zinc-400">{selectedProduct.releaseYear}</span>
            </p>

            {/* Rating Row */}
            <div className="mt-3 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(selectedProduct.rating) ? 'fill-amber-400' : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono-num font-semibold text-white">
                {selectedProduct.rating.toFixed(1)}
              </span>
              <span className="text-zinc-400 font-mono-num">
                ({selectedProduct.reviewCount} reader reviews)
              </span>
            </div>
          </div>

          {/* Price & Availability */}
          <div className="rounded-xl border border-zinc-800 bg-[#121217] p-5 space-y-5">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono-num text-3xl font-bold text-white">
                  ${selectedProduct.price.toFixed(2)}
                </span>
                {selectedProduct.originalPrice &&
                  selectedProduct.originalPrice > selectedProduct.price && (
                    <>
                      <span className="font-mono-num text-base text-zinc-500 line-through">
                        ${selectedProduct.originalPrice.toFixed(2)}
                      </span>
                      <span className="font-mono-num text-xs font-semibold text-rose-400">
                        Save {discountPct}%
                      </span>
                    </>
                  )}
              </div>
              <span
                className={`font-mono-num text-xs font-semibold ${
                  outOfStock ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {outOfStock ? 'Out of Stock' : `${selectedProduct.stock} copies in stock`}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-zinc-300">{selectedProduct.description}</p>

            {/* Quantity & Primary Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-lg border border-zinc-700 bg-zinc-950">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-zinc-300 hover:text-white transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-mono-num text-sm font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(Math.max(1, selectedProduct.stock), q + 1))
                    }
                    aria-label="Increase quantity"
                    className="p-2.5 text-zinc-300 hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={() => addToCart(selectedProduct.id, quantity)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors whitespace-nowrap"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{outOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className={`inline-flex items-center justify-center rounded-lg border px-3.5 py-3 transition-colors ${
                    wishlisted
                      ? 'border-rose-500 bg-rose-600/20 text-rose-400'
                      : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={handleBuyNow}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors whitespace-nowrap"
                >
                  <Zap className="h-4 w-4" />
                  <span>Buy Now (Cash on Delivery)</span>
                </button>

                <a
                  href={buildProductWhatsAppLink(selectedProduct, quantity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-5 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-900/40 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="rounded-xl border border-zinc-800 bg-[#121217] p-5 space-y-5">
            <h2 className="font-display text-lg font-semibold text-white">
              Reader Reviews ({selectedProduct.reviews.length})
            </h2>

            {selectedProduct.reviews.length > 0 ? (
              <div className="space-y-4">
                {selectedProduct.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="border-b border-zinc-800/80 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200">{rev.author}</span>
                      <span className="font-mono-num text-zinc-500">{rev.date}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="h-3 w-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="mt-1.5 text-sm text-zinc-300">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400">
                No written reviews yet for this volume. Be the first reader to share your thoughts.
              </p>
            )}

            <form
              onSubmit={handleReviewSubmit}
              className="border-t border-zinc-800 pt-4 space-y-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Leave a Reader Review
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none"
                />
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-rose-500 focus:outline-none"
                >
                  <option value={5}>5 Stars — Masterpiece</option>
                  <option value={4}>4 Stars — Great Read</option>
                  <option value={3}>3 Stars — Solid</option>
                  <option value={2}>2 Stars — Fair</option>
                  <option value={1}>1 Star — Disappointing</option>
                </select>
              </div>
              <textarea
                rows={2}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share print quality or story thoughts..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-600 transition-colors"
              >
                Post Review
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Related Manga */}
      <section className="mt-16 border-t border-zinc-800/80 pt-10">
        <h2 className="font-display text-2xl font-bold text-white">You May Also Collect</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <MangaCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
