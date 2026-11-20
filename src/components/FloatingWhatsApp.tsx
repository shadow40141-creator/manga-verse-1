import { MessageCircle } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '../utils/whatsapp';

export function FloatingWhatsApp() {
  return (
    <a
      href={buildGeneralWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Anime World on WhatsApp"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-black/50 hover:bg-emerald-500 active:scale-95 transition-all sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-4 w-4 fill-current" />
      <span className="hidden sm:inline whitespace-nowrap">WhatsApp Support</span>
    </a>
  );
}
