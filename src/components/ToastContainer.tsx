import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../context/StoreContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  return (
    <div
      className="fixed bottom-20 right-4 z-40 flex flex-col gap-2 max-w-xs w-full pointer-events-none sm:bottom-6 sm:right-20"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950/95 px-4 py-3 text-zinc-100 shadow-2xl backdrop-blur-md"
          >
            {toast.variant === 'error' ? (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
            ) : toast.variant === 'info' ? (
              <Info className="h-4 w-4 shrink-0 text-violet-400 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-zinc-500 hover:text-zinc-200 transition-colors p-0.5"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
