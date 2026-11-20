import { CheckCircle2, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { STORE_WHATSAPP_DISPLAY, buildGeneralWhatsAppLink } from '../utils/whatsapp';

export function ContactPage() {
  const { notify } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    notify('Message Sent', 'Our manga concierge team will reply shortly.');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-800/80 pb-6">
        <h1 className="font-display text-3xl font-bold text-white">Contact Anime World</h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Questions about volume reprints, wholesale box sets, or Cash on Delivery tracking? Reach
          out anytime.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Direct Contact Channels */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-[#121217] p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-white">Direct Channels</h2>

            <a
              href={buildGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-emerald-200 hover:bg-emerald-900/40 transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">Chat on WhatsApp</p>
                <p className="font-mono-num text-xs text-emerald-300">{STORE_WHATSAPP_DISPLAY}</p>
              </div>
            </a>

            <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <Mail className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Store Email</p>
                <p className="text-xs text-zinc-400">orders@animeworld.jp</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <MapPin className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Dispatch Hub</p>
                <p className="text-xs text-zinc-400">
                  3-14-7 Soto-Kanda, Chiyoda-ku, Tokyo &amp; Global Fulfillment
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Community Channels
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <a
                  href={buildGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-rose-400 transition-colors"
                >
                  Instagram @animeworld
                </a>
                <span aria-hidden="true" className="text-zinc-700">·</span>
                <a
                  href={buildGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-rose-400 transition-colors"
                >
                  X / Twitter @animeworld
                </a>
                <span aria-hidden="true" className="text-zinc-700">·</span>
                <a
                  href={buildGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-rose-400 transition-colors"
                >
                  Discord Readers Club
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-zinc-800 bg-[#121217] p-6">
            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
                <h2 className="font-display text-xl font-bold text-white">
                  Inquiry Received
                </h2>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  Thanks for reaching out, {name}. Our team will respond to {email} within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="mt-2 rounded-lg border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display text-lg font-semibold text-white">Send a Message</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Volume availability, pre-order, or order question"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us which manga series or volume you are looking for..."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
