import { Menu, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PageRoute } from '../types/manga';

const NAV_LINKS: Array<{ label: string; route: PageRoute }> = [
  { label: 'Shop', route: 'shop' },
  { label: 'Wishlist', route: 'wishlist' },
  { label: 'About', route: 'about' },
  { label: 'Contact', route: 'contact' },
  { label: 'Admin', route: 'admin' },
];

export function Navbar() {
  const { route, navigate, cartCount, wishlist, preferences, dismissPromoBanner } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (target: PageRoute) => {
    setMobileMenuOpen(false);
    navigate(target);
  };

  return (
    <div className="sticky top-0 z-40">
      {!preferences.promoBannerDismissed && (
        <div className="hidden sm:flex items-center justify-center gap-4 border-b border-zinc-800/80 bg-zinc-950 px-4 py-1.5 text-xs text-zinc-300">
          <span>
            Free Express Shipping on orders over $60 · Use code{' '}
            <strong className="font-mono-num text-rose-400">ANIMEWORLD10</strong> for 10% off
          </span>
          <button
            type="button"
            onClick={dismissPromoBanner}
            className="text-zinc-500 hover:text-zinc-200 transition-colors p-0.5"
            aria-label="Dismiss promotional banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <header className="border-b border-zinc-800/80 bg-[#09090B]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="font-display text-lg font-bold tracking-tight text-white hover:text-rose-400 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-sm"
          >
            Anime World
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {NAV_LINKS.map((item) => {
              const active = route === item.route;
              const suffix =
                item.route === 'wishlist' && wishlist.length > 0
                  ? ` (${wishlist.length})`
                  : '';
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => handleNavClick(item.route)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-sm ${
                    active ? 'text-white' : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {item.label}
                  <span className="font-mono-num text-xs text-rose-400">{suffix}</span>
                  {active && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-rose-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Cart) + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('cart')}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Cart</span>
              <span className="font-mono-num">({cartCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex md:hidden items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/70 p-2 text-zinc-200 hover:bg-zinc-800 transition-colors min-h-[40px] min-w-[40px]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-zinc-800 bg-[#09090B] md:hidden"
            >
              <nav className="flex flex-col px-4 py-3 gap-1">
                <button
                  type="button"
                  onClick={() => handleNavClick('home')}
                  className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-left min-h-[44px] ${
                    route === 'home'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-300 hover:bg-zinc-900/60'
                  }`}
                >
                  <span>Home</span>
                </button>
                {NAV_LINKS.map((item) => {
                  const active = route === item.route;
                  return (
                    <button
                      key={item.route}
                      type="button"
                      onClick={() => handleNavClick(item.route)}
                      className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-left min-h-[44px] ${
                        active
                          ? 'bg-zinc-900 text-white'
                          : 'text-zinc-300 hover:bg-zinc-900/60'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.route === 'wishlist' && wishlist.length > 0 && (
                        <span className="font-mono-num text-xs text-rose-400">
                          {wishlist.length} saved
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
