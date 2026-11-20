import { ArrowRight, BookOpen, PackageCheck, Sparkles } from 'lucide-react';
import { STORE_ASSETS } from '../data/mangaCatalog';
import { useStore } from '../context/StoreContext';

export function AboutPage() {
  const { navigate } = useStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-14">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-400">
            Our Story &amp; Craft
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built by Collectors, Dedicated to Physical Manga Print
          </h1>
          <p className="text-base leading-relaxed text-zinc-300">
            Anime World began as a late-night reading room inspired by Akihabara’s independent
            bookshops. We believe holding a printed tankobon—feeling the ink weight, crisp spine
            crease, and full-spread artwork—creates a connection digital scrolling never replaces.
          </p>
          <p className="text-sm leading-relaxed text-zinc-400">
            Every volume in our catalog is inspected before dispatch, sealed in acid-free collector
            sleeves, and shipped inside rigid corner-protected boxes so your Jujutsu Kaisen, Demon
            Slayer, Berserk, and One Piece shelves remain pristine.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
            >
              <span>Explore Our Collection</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <img
            src={STORE_ASSETS.aboutStudio}
            alt="Curated stack of Japanese manga volumes on obsidian slate"
            referrerPolicy="no-referrer"
            className="aspect-[4/3] w-full rounded-2xl border border-zinc-800 object-cover shadow-2xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 border-t border-zinc-800/80 pt-10">
        <div className="rounded-xl border border-zinc-800 bg-[#121217] p-6 space-y-3">
          <BookOpen className="h-6 w-6 text-rose-400" />
          <h2 className="font-display text-lg font-semibold text-white">Authentic Editions</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Licensed prints sourced directly from official publishers including Shueisha, VIZ
            Media, Kodansha Comics, and Yen Press.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#121217] p-6 space-y-3">
          <PackageCheck className="h-6 w-6 text-violet-400" />
          <h2 className="font-display text-lg font-semibold text-white">Archival Packaging</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Zero bent corners. Each order ships cushioned in kraft paper and protective sleeves with
            moisture-sealed wrapping.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#121217] p-6 space-y-3">
          <Sparkles className="h-6 w-6 text-amber-400" />
          <h2 className="font-display text-lg font-semibold text-white">Concierge Sourcing</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Looking for out-of-print volumes or full box sets? Message our WhatsApp desk anytime for
            custom availability checks.
          </p>
        </div>
      </div>
    </div>
  );
}
