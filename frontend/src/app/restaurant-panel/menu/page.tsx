'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { menuApi } from '@/lib/api';
import { MenuItem, MenuCategory } from '@/types';

const MOCK_CATEGORIES: MenuCategory[] = [
  { id: 'c1', name: 'Burgerler', restaurantId: 'r1', sortOrder: 1 },
  { id: 'c2', name: 'Tavuklar', restaurantId: 'r1', sortOrder: 2 },
  { id: 'c3', name: 'Menüler', restaurantId: 'r1', sortOrder: 3 },
  { id: 'c4', name: 'Atıştırmalıklar', restaurantId: 'r1', sortOrder: 4 },
  { id: 'c5', name: 'İçecekler', restaurantId: 'r1', sortOrder: 5 },
];

const MOCK_ITEMS: (MenuItem & { categoryName?: string })[] = [
  { id: 'm1', name: 'Whopper', description: 'Alev ızgara beef patty', price: 89.90, image: 'https://placehold.co/80x80/e8231a/white?text=W', categoryId: 'c1', categoryName: 'Burgerler', restaurantId: 'r1', isAvailable: true, preparationTime: 8 },
  { id: 'm2', name: 'Double Whopper', description: 'Çift katlı burger', price: 119.90, categoryId: 'c1', categoryName: 'Burgerler', restaurantId: 'r1', isAvailable: true },
  { id: 'm3', name: 'Cheeseburger', description: 'Klasik cheeseburger', price: 49.90, categoryId: 'c1', categoryName: 'Burgerler', restaurantId: 'r1', isAvailable: false },
  { id: 'm4', name: 'Crispy Chicken', description: 'Çıtır tavuk burger', price: 79.90, categoryId: 'c2', categoryName: 'Tavuklar', restaurantId: 'r1', isAvailable: true },
  { id: 'm5', name: 'Chicken Royal', description: 'Özel sos tavuk burger', price: 94.90, categoryId: 'c2', categoryName: 'Tavuklar', restaurantId: 'r1', isAvailable: true },
  { id: 'm6', name: 'Whopper Menü', description: 'Whopper + Patates + İçecek', price: 129.90, categoryId: 'c3', categoryName: 'Menüler', restaurantId: 'r1', isAvailable: true },
  { id: 'm8', name: 'Soğan Halkası', description: '8 adet çıtır soğan halkası', price: 39.90, categoryId: 'c4', categoryName: 'Atıştırmalıklar', restaurantId: 'r1', isAvailable: true },
  { id: 'm10', name: 'Cola', description: '500ml Coca-Cola', price: 24.90, categoryId: 'c5', categoryName: 'İçecekler', restaurantId: 'r1', isAvailable: true },
];

interface ItemFormState {
  id?: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  isAvailable: boolean;
  preparationTime: string;
}

const EMPTY_FORM: ItemFormState = {
  name: '',
  description: '',
  price: '',
  categoryId: 'c1',
  isAvailable: true,
  preparationTime: '10',
};

export default function RestaurantMenuPage() {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [selectedCat, setSelectedCat] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<ItemFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = items.filter((i) => {
    if (selectedCat !== 'all' && i.categoryId !== selectedCat) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleEdit = (item: typeof items[0]) => {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description ?? '',
      price: item.price.toString(),
      categoryId: item.categoryId,
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime?.toString() ?? '10',
    });
    setFormOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    toast.success('Ürün silindi.');
    menuApi.deleteItem('r1', itemId).catch(() => {});
  };

  const handleToggleAvailable = (itemId: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, isAvailable: !i.isAvailable } : i))
    );
    menuApi.updateItem('r1', itemId, {
      isAvailable: !items.find((i) => i.id === itemId)?.isAvailable,
    }).catch(() => {});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Ad ve fiyat zorunludur.');
      return;
    }
    setSaving(true);
    try {
      const data = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        categoryId: form.categoryId,
        isAvailable: form.isAvailable,
        preparationTime: parseInt(form.preparationTime) || 10,
        restaurantId: 'r1',
      };
      if (form.id) {
        setItems((prev) => prev.map((i) => (i.id === form.id ? { ...i, ...data } : i)));
        toast.success('Ürün güncellendi!');
        await menuApi.updateItem('r1', form.id, data);
      } else {
        const newItem = { id: `m${Date.now()}`, ...data, categoryName: MOCK_CATEGORIES.find((c) => c.id === form.categoryId)?.name };
        setItems((prev) => [...prev, newItem]);
        toast.success('Ürün eklendi!');
      }
      setFormOpen(false);
      setForm(EMPTY_FORM);
    } catch {
      toast.error('Kayıt başarısız.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-gray-800">Menü Yönetimi</h2>
        <button
          onClick={() => { setForm(EMPTY_FORM); setFormOpen(true); }}
          className="btn-primary text-sm py-2.5 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input className="input-field pl-10 text-sm" placeholder="Ürün ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelectedCat('all')} className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${selectedCat === 'all' ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-600'}`}>
            Tümü ({items.length})
          </button>
          {MOCK_CATEGORIES.map((cat) => {
            const count = items.filter((i) => i.categoryId === cat.id).length;
            return (
              <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${selectedCat === cat.id ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-600'}`}>
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Items table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Ürün</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Kategori</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Fiyat</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Durum</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-500">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">🍽️</div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        {item.description && <p className="text-xs text-gray-400 truncate max-w-[200px]">{item.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="badge bg-gray-100 text-gray-600">{item.categoryName}</span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-primary">{item.price.toFixed(2)} ₺</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => handleToggleAvailable(item.id)} className={`relative w-11 h-6 rounded-full transition-colors ${item.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.isAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <span className="text-4xl">🍽️</span>
              <p className="mt-2">Ürün bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFormOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 z-10 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-gray-800">{form.id ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
              <button onClick={() => setFormOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Ürün Adı *</label>
                <input className="input-field" placeholder="Whopper" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Açıklama</label>
                <textarea className="input-field resize-none h-16 text-sm" placeholder="Ürün açıklaması..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Fiyat (₺) *</label>
                  <input type="number" step="0.01" min="0" className="input-field" placeholder="89.90" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Hazırlık (dk)</label>
                  <input type="number" min="1" className="input-field" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Kategori</label>
                <select className="input-field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  {MOCK_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-primary w-4 h-4" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
                <span className="text-sm text-gray-700">Ürün aktif (sipariş alınabilir)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary flex-1 py-3 text-sm">İptal</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 text-sm">
                  {saving ? 'Kaydediliyor...' : (form.id ? 'Güncelle' : 'Ekle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
