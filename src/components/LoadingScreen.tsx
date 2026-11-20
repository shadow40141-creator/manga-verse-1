import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 520);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090B] text-zinc-100 pointer-events-none"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative flex items-center justify-center w-14 h-14 border border-rose-500/40 bg-zinc-950">
              <span className="font-display text-2xl font-bold tracking-tight text-rose-500">
                鉄
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500" />
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-semibold tracking-wider text-white">
                ANIME WORLD
              </p>
              <div className="mt-2 h-0.5 w-36 overflow-hidden bg-zinc-800">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full w-full bg-gradient-to-r from-rose-600 to-violet-500"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
