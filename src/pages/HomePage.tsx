import { ArrowRight, Sparkles, Star, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { AmbientParticles } from '../components/AmbientParticles';
import { MangaCard } from '../components/MangaCard';
import { MANGA_SERIES_LIST, STORE_ASSETS } from '../data/mangaCatalog';
import { useStore } from '../context/StoreContext';
import { buildGeneralWhatsAppLink } from '../utils/whatsapp';

type ShowcaseTab = 'featured' | 'bestsellers' | 'new' | 'trending' | 'deals';

export function HomePage() {
  const { products, navigate } = useStore();
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('featured');
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const showcasedProducts = useMemo(() => {
    switch (activeTab) {
      case 'bestsellers':
        return [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 9);
      case 'new':
        return products.filter((p) => p.isNewArrival).slice(0, 9);
      case 'trending':
        return products.filter((p) => p.isTrending).slice(0, 9);
      case 'deals':
        return products.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 9);
      case 'featured':
      default:
        return products.filter((p) => p.isFeatured).slice(0, 9);
    }
  }, [activeTab, products]);

  const spotlightCandidates = useMemo(() => {
    const ids = ['op-vol-103', 'jjk-vol-01', 'dn-vol-01'];
    const found = ids
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    return found.length > 0 ? found : products.slice(0, 3);
  }, [products]);

  const spotlightProduct =
    spotlightCandidates[spotlightIndex % spotlightCandidates.length] ?? products[0];

  return (
    <div className="space-y-16 pb-20">
      {/* Section 1: Atmospheric Anime Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800/80 bg-[#09090B]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={STORE_ASSETS.heroSanctuary}
            alt="Anime World Japanese bookstore sanctuary"
            referrerPolicy="no-referrer"
            className="animate-hero-pan h-full w-full object-cover object-center opacity-55"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/85 to-[#09090B]/40"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-[#09090B]/50"
            aria-hidden="true"
          />
        </div>

        <AmbientParticles />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <p className="text-xs font-medium tracking-widest text-rose-400 uppercase">
                Akihabara Print Archive · Worldwide Delivery
              </p>

              <h1
                className="font-display font-bold tracking-tight text-white leading-[1.04]"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
                  textWrap: 'balance',
                }}
              >
                ENTER THE WORLD OF MANGA
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                Collect authentic tankobon volumes across One Piece, Jujutsu Kaisen, Death Note by
                Tsugumi Ohba &amp; Takeshi Obata, Demon Slayer, Attack on Titan, and more.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('shop', { seriesFilter: 'All' })}
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/50 hover:bg-rose-500 active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  <span>Explore All {products.length} Volumes</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href={buildGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/80 px-5 py-3 text-sm font-medium text-zinc-100 backdrop-blur-sm hover:border-zinc-500 hover:bg-zinc-800 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-rose-400" />
                  Official Print Editions
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-violet-400" />
                  Cash on Delivery Available
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono-num">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  4.9 Average Reader Rating
                </span>
              </div>
            </motion.div>

            {/* Featured Volume Spotlight Card */}
            {spotlightProduct && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative hidden lg:block lg:col-span-5"
              >
                <div
                  className="animate-slow-spin pointer-events-none absolute -inset-6 mx-auto my-auto h-[440px] w-[440px] rounded-full border border-dashed border-rose-500/20"
                  aria-hidden="true"
                />
                <div className="relative mx-auto max-w-sm rounded-2xl border border-zinc-800/90 bg-zinc-950/85 p-5 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      {spotlightCandidates.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSpotlightIndex(idx)}
                          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                            idx === spotlightIndex % spotlightCandidates.length
                              ? 'bg-rose-600 text-white'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {item.series}
                        </button>
                      ))}
                    </div>
                    <span className="font-mono-num text-rose-400 shrink-0">
                      Vol. {String(spotlightProduct.volume).padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('details', { productId: spotlightProduct.id })}
                    className="group block w-full overflow-hidden rounded-lg border border-zinc-800"
                  >
                    <img
                      src={spotlightProduct.coverImage}
                      alt={spotlightProduct.title}
                      referrerPolicy="no-referrer"
                      className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </button>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-display text-base font-semibold text-white truncate">
                        {spotlightProduct.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {spotlightProduct.author} · {spotlightProduct.series}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('details', { productId: spotlightProduct.id })}
                      className="shrink-0 rounded-lg bg-zinc-800 px-3.5 py-2 font-mono-num text-xs font-semibold text-white hover:bg-rose-600 transition-colors"
                    >
                      ${spotlightProduct.price.toFixed(2)}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Curated Collections Directory (All 13 Series) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Explore Manga Universes
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Jump directly into our 13 curated shonen, seinen, and dark fantasy series.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('shop', { seriesFilter: 'All' })}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors self-start sm:self-auto"
          >
            <span>View Full Catalog ({products.length})</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {MANGA_SERIES_LIST.map((series) => {
            const count = products.filter((p) => p.series === series).length;
            return (
              <button
                key={series}
                type="button"
                onClick={() => navigate('shop', { seriesFilter: series })}
                className="group flex items-center justify-between gap-2 rounded-lg border border-zinc-800/90 bg-[#121217] px-3.5 py-3 text-left hover:border-rose-500/60 hover:bg-zinc-900 transition-colors"
              >
                <span className="text-sm font-medium text-zinc-200 group-hover:text-white truncate">
                  {series}
                </span>
                <span className="font-mono-num text-xs text-zinc-500 group-hover:text-rose-400 shrink-0">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Interactive Storefront Shelf */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-zinc-800/80 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Curated Volumes
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Handpicked volumes ready for express dispatch or instant WhatsApp ordering.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Manga collection views"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 p-1"
          >
            {[
              { id: 'featured', label: 'Featured' },
              { id: 'bestsellers', label: 'Best Sellers' },
              { id: 'new', label: 'New Arrivals' },
              { id: 'trending', label: 'Trending' },
              { id: 'deals', label: 'Special Offers' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id as ShowcaseTab)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-rose-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcasedProducts.map((product) => (
            <MangaCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('shop', { seriesFilter: 'All' })}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:border-rose-500/60 hover:bg-zinc-800 transition-colors"
          >
            <span>Browse All {products.length} Manga Volumes</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Section 4: Collector Edition Promotional Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-[#14141B] via-[#121218] to-[#1D1225] p-8 sm:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-violet-300 uppercase">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span>Collector Perks · Archival Protection</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Save 10% on Every Manga Bundle + Free Shipping Over $60
              </h2>
              <p className="text-sm leading-relaxed text-zinc-300 max-w-xl">
                Every volume ships sealed inside acid-free archival sleeves with reinforced corner
                protectors. Apply code <span className="font-mono-num text-rose-400">ANIMEWORLD10</span>{' '}
                at checkout or request custom box-set pricing directly on WhatsApp.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('shop', { seriesFilter: 'All' })}
                  className="rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors whitespace-nowrap"
                >
                  Shop All Volumes
                </button>
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="rounded-lg border border-zinc-700 px-5 py-2.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500 transition-colors whitespace-nowrap"
                >
                  Our Archival Standard
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <img
                src={STORE_ASSETS.aboutStudio}
                alt="Stacked manga collector editions"
                referrerPolicy="no-referrer"
                className="aspect-[4/3] w-full rounded-xl border border-zinc-800 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
