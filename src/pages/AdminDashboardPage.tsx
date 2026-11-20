import {
  Edit3,
  Package,
  Plus,
  RotateCcw,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  COVER_PRESET_OPTIONS,
  MANGA_SERIES_LIST,
  STORE_ASSETS,
} from '../data/mangaCatalog';
import { useStore } from '../context/StoreContext';
import { MangaProduct, MangaSeries, OrderStatus } from '../types/manga';

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Shipped',
  'Delivered',
  'Cancelled',
];

interface ProductFormState {
  title: string;
  japaneseTitle: string;
  series: MangaSeries;
  volume: number;
  author: string;
  price: number;
  originalPrice: string;
  stock: number;
  releaseYear: number;
  pages: number;
  publisher: string;
  coverImage: string;
  spineColor: string;
  description: string;
}

const EMPTY_FORM: ProductFormState = {
  title: '',
  japaneseTitle: '',
  series: 'Jujutsu Kaisen',
  volume: 1,
  author: '',
  price: 11.99,
  originalPrice: '',
  stock: 20,
  releaseYear: 2026,
  pages: 192,
  publisher: 'Shueisha · VIZ Media',
  coverImage: STORE_ASSETS.covers.jujutsuKaisen,
  spineColor: '#E11D48',
  description: '',
};

export function AdminDashboardPage() {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    resetDemoCatalog,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);

  const metrics = useMemo(() => {
    const lowStock = products.filter((p) => p.stock <= 10).length;
    const revenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    return {
      totalTitles: products.length,
      lowStock,
      totalOrders: orders.length,
      revenue,
    };
  }, [products, orders]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (product: MangaProduct) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      japaneseTitle: product.japaneseTitle,
      series: product.series,
      volume: product.volume,
      author: product.author,
      price: product.price,
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      stock: product.stock,
      releaseYear: product.releaseYear,
      pages: product.pages,
      publisher: product.publisher,
      coverImage: product.coverImage,
      spineColor: product.spineColor,
      description: product.description,
    });
    setModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedOriginal =
      form.originalPrice.trim() && Number(form.originalPrice) > form.price
        ? Number(form.originalPrice)
        : undefined;

    if (editingId) {
      updateProduct(editingId, {
        title: form.title.trim(),
        japaneseTitle: form.japaneseTitle.trim(),
        series: form.series,
        volume: Number(form.volume),
        author: form.author.trim(),
        price: Number(form.price),
        originalPrice: parsedOriginal,
        stock: Number(form.stock),
        releaseYear: Number(form.releaseYear),
        pages: Number(form.pages),
        publisher: form.publisher.trim(),
        coverImage: form.coverImage,
        spineColor: form.spineColor,
        description: form.description.trim(),
      });
    } else {
      addProduct({
        title: form.title.trim(),
        japaneseTitle: form.japaneseTitle.trim() || '漫画',
        series: form.series,
        volume: Number(form.volume),
        author: form.author.trim(),
        price: Number(form.price),
        originalPrice: parsedOriginal,
        rating: 4.8,
        stock: Number(form.stock),
        releaseYear: Number(form.releaseYear),
        pages: Number(form.pages),
        publisher: form.publisher.trim(),
        coverImage: form.coverImage,
        spineColor: form.spineColor,
        description: form.description.trim(),
        isNewArrival: true,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Store Admin Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage manga catalog, pricing, inventory stock, and customer orders in LocalStorage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={resetDemoCatalog}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Manga</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-[#121217] p-5">
          <p className="text-xs text-zinc-400">Catalog Titles</p>
          <p className="mt-1.5 font-mono-num text-2xl font-bold text-white">
            {metrics.totalTitles}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#121217] p-5">
          <p className="text-xs text-zinc-400">Low Stock (&le;10)</p>
          <p className="mt-1.5 font-mono-num text-2xl font-bold text-amber-400">
            {metrics.lowStock}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#121217] p-5">
          <p className="text-xs text-zinc-400">Total Orders</p>
          <p className="mt-1.5 font-mono-num text-2xl font-bold text-white">
            {metrics.totalOrders}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#121217] p-5">
          <p className="text-xs text-zinc-400">Gross Revenue</p>
          <p className="mt-1.5 font-mono-num text-2xl font-bold text-emerald-400">
            ${metrics.revenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* View Switcher */}
      <div className="inline-flex rounded-xl border border-zinc-800 bg-zinc-950 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === 'inventory'
              ? 'bg-rose-600 text-white'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <Package className="h-3.5 w-3.5" />
          <span>Catalog &amp; Inventory ({products.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === 'orders'
              ? 'bg-rose-600 text-white'
              : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          <span>Customer Orders ({orders.length})</span>
        </button>
      </div>

      {/* Tab 1: Inventory Table */}
      {activeTab === 'inventory' ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#121217]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-950/70 text-xs uppercase text-zinc-400">
              <tr>
                <th className="px-4 py-3.5 font-medium">Manga Title</th>
                <th className="px-4 py-3.5 font-medium">Series</th>
                <th className="px-4 py-3.5 font-medium">Vol.</th>
                <th className="px-4 py-3.5 font-medium">Price ($)</th>
                <th className="px-4 py-3.5 font-medium">Stock</th>
                <th className="px-4 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.coverImage}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="h-11 w-8 rounded object-cover border border-zinc-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate max-w-[240px]">
                          {product.title}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">{product.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">{product.series}</td>
                  <td className="px-4 py-3 font-mono-num text-zinc-300">
                    {String(product.volume).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={1}
                      step={0.5}
                      value={product.price}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (!Number.isNaN(val) && val > 0) {
                          updateProduct(product.id, { price: val });
                        }
                      }}
                      aria-label={`Price for ${product.title}`}
                      className="w-20 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono-num text-xs text-white focus:border-rose-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={product.stock}
                      onChange={(e) => {
                        const val = Math.max(0, Math.floor(Number(e.target.value)));
                        if (!Number.isNaN(val)) {
                          updateProduct(product.id, { stock: val });
                        }
                      }}
                      aria-label={`Stock for ${product.title}`}
                      className={`w-20 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono-num text-xs focus:border-rose-500 focus:outline-none ${
                        product.stock <= 5 ? 'text-rose-400' : 'text-zinc-100'
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openEditModal(product)}
                      className="inline-flex items-center gap-1 rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 mr-2"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      aria-label={`Delete ${product.title}`}
                      className="inline-flex items-center justify-center rounded-md border border-zinc-800 p-1.5 text-zinc-400 hover:border-rose-500/50 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Tab 2: Orders Table */
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-[#121217] p-10 text-center text-sm text-zinc-400">
              No customer orders recorded yet.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-zinc-800 bg-[#121217] p-5 space-y-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono-num text-sm font-bold text-white">
                        {order.id}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono-num">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-zinc-400">· {order.paymentMethod}</span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-200">
                      {order.customer.fullName} —{' '}
                      <span className="font-mono-num text-xs text-zinc-400">
                        {order.customer.phone} (WA: {order.customer.whatsapp})
                      </span>
                    </p>
                    <p className="text-xs text-zinc-400">
                      {order.customer.address}, {order.customer.city} {order.customer.postalCode}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className="font-mono-num text-lg font-bold text-white">
                      ${order.total.toFixed(2)}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      aria-label={`Order status for ${order.id}`}
                      className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-semibold text-zinc-100 focus:border-rose-500 focus:outline-none"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          Status: {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.productId}`}
                      className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-950 px-3 py-2"
                    >
                      <span className="text-zinc-300 truncate pr-2">
                        {item.title} (Vol. {item.volume}) × {item.quantity}
                      </span>
                      <span className="font-mono-num text-zinc-200 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add / Edit Manga Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-[#121217] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="font-display text-xl font-bold text-white">
                {editingId ? 'Edit Manga Volume' : 'Add New Manga Volume'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Manga Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Jujutsu Kaisen: Shibuya Incident"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Anime Series
                </label>
                <select
                  value={form.series}
                  onChange={(e) => {
                    const nextSeries = e.target.value as MangaSeries;
                    const matched = COVER_PRESET_OPTIONS.find((opt) =>
                      opt.label.startsWith(nextSeries)
                    );
                    setForm({
                      ...form,
                      series: nextSeries,
                      coverImage: matched ? matched.url : form.coverImage,
                    });
                  }}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                >
                  {MANGA_SERIES_LIST.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Japanese Title (Optional)
                </label>
                <input
                  type="text"
                  value={form.japaneseTitle}
                  onChange={(e) => setForm({ ...form, japaneseTitle: e.target.value })}
                  placeholder="呪術廻戦"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Author</label>
                <input
                  type="text"
                  required
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Mangaka name"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Volume Number
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.volume}
                  onChange={(e) => setForm({ ...form, volume: Number(e.target.value) })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono-num text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  min={1}
                  step={0.01}
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono-num text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Original Price (Optional Discount)
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  placeholder="14.99"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono-num text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono-num text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Cover Artwork Style
                </label>
                <select
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                >
                  {COVER_PRESET_OPTIONS.map((opt) => (
                    <option key={opt.url} value={opt.url}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Synopsis / Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the story arc and edition specs..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-5 py-2 text-xs font-semibold text-white hover:bg-rose-500"
                >
                  {editingId ? 'Save Changes' : 'Add Manga to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
