import { BookOpen } from 'lucide-react';
import { useState } from 'react';

interface MangaCoverProps {
  src: string;
  alt: string;
  series: string;
  japaneseTitle?: string;
  volume: number;
  spineColor?: string;
  className?: string;
}

export function MangaCover({
  src,
  alt,
  series,
  japaneseTitle,
  volume,
  spineColor = '#E11D48',
  className = '',
}: MangaCoverProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden bg-zinc-900 select-none ${className}`}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-rose-950/40 p-4 text-center">
          <BookOpen className="h-8 w-8 text-rose-500 mb-2" />
          <p className="font-display text-sm font-semibold text-zinc-200">{series}</p>
          <p className="font-mono-num text-xs text-zinc-400 mt-1">
            Vol. {String(volume).padStart(2, '0')}
          </p>
        </div>
      )}

      {/* Subtle tankobon spine crease & measured dark scrim for legibility */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1.5 opacity-85"
        style={{ backgroundColor: spineColor }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"
        aria-hidden="true"
      />

      {/* Clean unboxed volume & series imprint on bottom edge of cover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-3.5 pb-3 pt-6">
        <div className="min-w-0">
          {japaneseTitle && (
            <p className="text-[11px] font-medium tracking-wider text-zinc-300/90 truncate">
              {japaneseTitle}
            </p>
          )}
          <p className="font-display text-xs font-semibold tracking-wide text-white truncate">
            {series}
          </p>
        </div>
        <span className="font-mono-num shrink-0 text-xs font-semibold text-rose-400">
          VOL.{String(volume).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
