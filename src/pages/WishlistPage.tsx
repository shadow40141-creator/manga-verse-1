import { ArrowRight, Heart } from 'lucide-react';
import { MangaCard } from '../components/MangaCard';
import { useStore } from '../context/StoreContext';

export function WishlistPage() {
  const { wishlistProducts, navigate } = useStore();

  if (wishlistProducts.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-[#121217] text-zinc-400">
          <Heart className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-white">Your Wishlist is Empty</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Save volumes you want to collect later by clicking the heart icon on any manga card.
        </p>
        <button
          type="button"
          onClick={() => navigate('shop')}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
        >
          <span>Discover Manga</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 border-b border-zinc-800/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Saved Wishlist</h1>
          <p className="mt-1 text-sm text-zinc-400">
            <span className="font-mono-num text-zinc-200">{wishlistProducts.length}</span> saved
            volumes stored in your browser.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('shop')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-400 hover:text-rose-300"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistProducts.map((product) => (
          <MangaCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
