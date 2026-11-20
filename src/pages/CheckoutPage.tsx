import { ArrowLeft, CheckCircle2, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CustomerDetails, Order } from '../types/manga';
import { buildWhatsAppLink } from '../utils/whatsapp';

export function CheckoutPage() {
  const { cartDetailed, cartSubtotal, placeOrder, navigate } = useStore();

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<
    'Cash on Delivery' | 'WhatsApp Express Order'
  >('Cash on Delivery');
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const shipping = cartSubtotal >= 60 || cartSubtotal === 0 ? 0 : 4.99;
  const total = cartSubtotal + shipping;

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof CustomerDetails, string>> = {};
    if (customer.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    if (customer.phone.trim().length < 7) {
      nextErrors.phone = 'Please enter a valid phone number.';
    }
    if (customer.whatsapp.trim().length < 7) {
      nextErrors.whatsapp = 'Please enter a valid WhatsApp number.';
    }
    if (customer.address.trim().length < 5) {
      nextErrors.address = 'Please enter your street delivery address.';
    }
    if (customer.city.trim().length < 2) {
      nextErrors.city = 'Please enter your city.';
    }
    if (customer.postalCode.trim().length < 3) {
      nextErrors.postalCode = 'Please enter a postal code.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || cartDetailed.length === 0) return;

    const order = placeOrder(customer, paymentMethod, 0);
    setConfirmedOrder(order);
  };

  if (confirmedOrder) {
    const whatsappReceiptUrl = buildWhatsAppLink(
      [
        `Order ${confirmedOrder.id} Confirmed — Anime World`,
        `Customer: ${confirmedOrder.customer.fullName}`,
        `Phone: ${confirmedOrder.customer.phone}`,
        `Address: ${confirmedOrder.customer.address}, ${confirmedOrder.customer.city} ${confirmedOrder.customer.postalCode}`,
        `Payment: ${confirmedOrder.paymentMethod}`,
        `Items:`,
        ...confirmedOrder.items.map(
          (i) => `• ${i.title} (Vol. ${i.volume}) x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`
        ),
        `Total: $${confirmedOrder.total.toFixed(2)}`,
      ].join('\n')
    );

    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-zinc-800 bg-[#121217] p-8 space-y-6">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="h-8 w-8 shrink-0" />
            <div>
              <p className="font-mono-num text-xs uppercase tracking-wider text-emerald-300">
                Order {confirmedOrder.id} Confirmed
              </p>
              <h1 className="font-display text-2xl font-bold text-white">
                Preparing Your Manga Shipment
              </h1>
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            Thank you, <strong className="text-white">{confirmedOrder.customer.fullName}</strong>.
            Your order is logged for <strong className="text-white">{confirmedOrder.paymentMethod}</strong>{' '}
            and our Tokyo dispatch team will verify delivery via WhatsApp at{' '}
            <span className="font-mono-num text-zinc-100">{confirmedOrder.customer.whatsapp}</span>.
          </p>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3 text-sm">
            {confirmedOrder.items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-4">
                <span className="text-zinc-300">
                  {item.title} (Vol. {String(item.volume).padStart(2, '0')}) × {item.quantity}
                </span>
                <span className="font-mono-num text-zinc-100 shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-zinc-800 pt-3 font-semibold text-white">
              <span>Total Amount ({confirmedOrder.paymentMethod})</span>
              <span className="font-mono-num">${confirmedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Send Receipt on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartDetailed.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-white">No Items Ready for Checkout</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Your shopping cart is currently empty. Add manga volumes before checking out.
        </p>
        <button
          type="button"
          onClick={() => navigate('shop')}
          className="mt-6 rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-500 transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate('cart')}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Cart</span>
      </button>

      <h1 className="mt-4 font-display text-3xl font-bold text-white">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-[#121217] p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-white">
              Delivery &amp; Contact Information
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Customer Full Name
                </label>
                <input
                  type="text"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  placeholder="e.g., Kenji Takahashi"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-400">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="+1 555 019 2834"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
                />
                {errors.phone && <p className="mt-1 text-xs text-rose-400">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={customer.whatsapp}
                  onChange={(e) => setCustomer({ ...customer, whatsapp: e.target.value })}
                  placeholder="+1 555 019 2834"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-xs text-rose-400">{errors.whatsapp}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Delivery Street Address
                </label>
                <input
                  type="text"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Apartment, street, building"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-rose-400">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">City</label>
                <input
                  type="text"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  placeholder="Tokyo / Los Angeles / London"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
                />
                {errors.city && <p className="mt-1 text-xs text-rose-400">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={customer.postalCode}
                  onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                  placeholder="90012"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-xs text-rose-400">{errors.postalCode}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Delivery Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  placeholder="Gate code, collector wrapping instructions..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border border-zinc-800 bg-[#121217] p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-white">Payment Option</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-rose-500 bg-rose-950/20'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <Truck className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Cash on Delivery</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Pay in cash when your manga parcel arrives at your door.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('WhatsApp Express Order')}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                  paymentMethod === 'WhatsApp Express Order'
                    ? 'border-emerald-500 bg-emerald-950/20'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <MessageCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">WhatsApp Express Order</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Confirm order total &amp; arrange payment directly over WhatsApp.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-zinc-800 bg-[#121217] p-6 space-y-5 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold text-white">Order Summary</h2>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartDetailed.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-100 truncate">{product.title}</p>
                    <p className="text-xs text-zinc-400 font-mono-num">
                      Vol. {String(product.volume).padStart(2, '0')} × {quantity}
                    </p>
                  </div>
                  <span className="font-mono-num text-zinc-200 shrink-0">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-zinc-800 pt-4 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono-num text-zinc-200">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span className="font-mono-num text-zinc-200">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-3 text-base font-semibold text-white">
                <span>Total Due</span>
                <span className="font-mono-num">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-rose-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-rose-500 active:scale-[0.99] transition-all"
            >
              Place Order
            </button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Protected with corner-guard archival packaging
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
