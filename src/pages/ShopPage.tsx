import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MangaCard } from '../components/MangaCard';
import { MANGA_SERIES_LIST } from '../data/mangaCatalog';
import { useStore } from '../context/StoreContext';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'bestselling';

export function ShopPage() {
  const { products, seriesFilter, setSeriesFilter } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(30);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = products.filter((p) => {
      if (seriesFilter !== 'All' && p.series !== seriesFilter) return false;
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (q) {
        const match =
          p.title.toLowerCase().includes(q) ||
          p.series.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.japaneseTitle.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return b.releaseYear - a.releaseYear || b.volume - a.volume;
        case 'bestselling':
          return b.salesCount - a.salesCount;
        case 'featured':
        default:
          return Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
      }
    });
  }, [products, seriesFilter, maxPrice, minRating, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSeriesFilter('All');
    setMaxPrice(30);
    setMinRating(0);
    setSortBy('featured');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">
          Shop Manga Catalog
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Browse <span className="font-mono-num text-zinc-200">{products.length}</span> volumes across
          13 iconic anime collections.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-zinc-800 bg-[#121217] p-4 lg:grid-cols-12 lg:items-center">
        {/* Search Input */}
        <div className="relative lg:col-span-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, series, or author..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none"
          />
        </div>

        {/* Series Dropdown */}
        <div className="lg:col-span-3">
          <label htmlFor="series-filter" className="sr-only">
            Filter by anime series
          </label>
          <select
            id="series-filter"
            value={seriesFilter}
            onChange={(e) => setSeriesFilter(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-rose-500 focus:outline-none"
          >
            <option value="All">All Anime Series (13)</option>
            {MANGA_SERIES_LIST.map((series) => (
              <option key={series} value={series}>
                {series}
              </option>
            ))}
          </select>
        </div>

        {/* Popularity / Rating Filter */}
        <div className="lg:col-span-2">
          <label htmlFor="rating-filter" className="sr-only">
            Minimum rating
          </label>
          <select
            id="rating-filter"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-rose-500 focus:outline-none"
          >
            <option value={0}>Any Rating</option>
            <option value={4.8}>4.8★ &amp; Up</option>
            <option value={4.9}>4.9★ Top Rated</option>
          </select>
        </div>

        {/* Sort Selector */}
        <div className="lg:col-span-3">
          <label htmlFor="sort-select" className="sr-only">
            Sort manga
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-rose-500 focus:outline-none"
          >
            <option value="featured">Sort: Featured</option>
            <option value="bestselling">Sort: Best Selling</option>
            <option value="newest">Sort: Newest Releases</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
          </select>
        </div>

        {/* Price Slider & Reset Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800/80 pt-3 lg:col-span-12">
          <div className="flex items-center gap-3 text-xs text-zinc-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-rose-400" />
            <label htmlFor="price-range" className="whitespace-nowrap">
              Max Price:{' '}
              <span className="font-mono-num font-semibold text-white">${maxPrice}</span>
            </label>
            <input
              id="price-range"
              type="range"
              min={10}
              max={30}
              step={1}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-32 sm:w-44 accent-rose-500"
            />
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="font-mono-num text-zinc-400">
              Showing {filteredProducts.length} of {products.length} volumes
            </span>
            {(seriesFilter !== 'All' || searchQuery || maxPrice < 30 || minRating > 0) && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium"
              >
                <X className="h-3.5 w-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Quick Switch Row */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSeriesFilter('All')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
            seriesFilter === 'All'
              ? 'bg-rose-600 text-white'
              : 'border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-100'
          }`}
        >
          All Series
        </button>
        {MANGA_SERIES_LIST.map((series) => (
          <button
            key={series}
            type="button"
            onClick={() => setSeriesFilter(series)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              seriesFilter === series
                ? 'bg-rose-600 text-white'
                : 'border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-100'
            }`}
          >
            {series}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <MangaCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-zinc-800 bg-[#121217] p-12 text-center">
          <p className="font-display text-lg font-semibold text-white">
            No manga volumes match your filters
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Try clearing your search term or increasing the maximum price limit.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-lg bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
