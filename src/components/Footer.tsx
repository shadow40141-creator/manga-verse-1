import { MANGA_SERIES_LIST } from '../data/mangaCatalog';
import { useStore } from '../context/StoreContext';
import { STORE_WHATSAPP_DISPLAY, buildGeneralWhatsAppLink } from '../utils/whatsapp';

export function Footer() {
  const { navigate } = useStore();

  return (
    <footer className="border-t border-zinc-800/80 bg-[#070709] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <h2 className="font-display text-lg font-bold text-white">Anime World</h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              Curated Japanese tankobon volumes, collector editions, and shonen classics packaged
              with archival sleeves and dispatched worldwide.
            </p>
            <p className="font-mono-num text-xs text-zinc-500">
              WhatsApp Orders: {STORE_WHATSAPP_DISPLAY}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { seriesFilter: 'All' })}
                  className="hover:text-white transition-colors"
                >
                  Shop All Manga
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('wishlist')}
                  className="hover:text-white transition-colors"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Store
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('admin')}
                  className="hover:text-white transition-colors"
                >
                  Owner Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Featured Series Collections
            </h3>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {MANGA_SERIES_LIST.map((series) => (
                <button
                  key={series}
                  type="button"
                  onClick={() => navigate('shop', { seriesFilter: series })}
                  className="text-left text-zinc-400 hover:text-rose-400 transition-colors truncate"
                >
                  {series}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Anime World Bookstore. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href={buildGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors"
            >
              WhatsApp Desk
            </a>
            <button
              type="button"
              onClick={() => navigate('checkout')}
              className="hover:text-zinc-200 transition-colors"
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
