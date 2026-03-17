// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  category: string;
  address: string;
  city: string;
  phone?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  minimumOrderAmount: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
  status: string;
  isOpen: boolean;
  rating: number;
  totalRatings: number;
  createdAt: string;
  owner?: { firstName?: string; lastName?: string; email?: string };
  menuItems?: { id: string; name: string; price: number; isAvailable: boolean }[];
}

export default function AdminRestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    city: '',
    phone: '',
    logoUrl: '',
    coverImageUrl: '',
    minimumOrderAmount: 0,
    deliveryFee: 0,
    estimatedDeliveryTime: 30,
  });

  useEffect(() => {
    if (!id) return;
    adminApi.getRestaurants()
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        const r = list.find((x: Restaurant) => x.id === id);
        if (r) {
          setRestaurant(r);
          setForm({
            name: r.name ?? '',
            description: r.description ?? '',
            category: r.category ?? '',
            address: r.address ?? '',
            city: r.city ?? '',
            phone: r.phone ?? '',
            logoUrl: r.logoUrl ?? '',
            coverImageUrl: r.coverImageUrl ?? '',
            minimumOrderAmount: Number(r.minimumOrderAmount) ?? 0,
            deliveryFee: Number(r.deliveryFee) ?? 0,
            estimatedDeliveryTime: r.estimatedDeliveryTime ?? 30,
          });
        }
      })
      .catch(() => toast.error('Restoran yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateRestaurant(id, form);
      toast.success('Restoran güncellendi!');
      router.push('/admin/restaurants');
    } catch {
      toast.error('Kayıt başarısız.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 bg-white rounded-xl animate-pulse w-48" />
      <div className="bg-white rounded-2xl h-96 animate-pulse" />
    </div>
  );

  if (!restaurant) return (
    <div className="text-center py-20">
      <span className="text-5xl">🏪</span>
      <p className="text-gray-500 mt-3">Restoran bulunamadı.</p>
      <Link href="/admin/restaurants" className="mt-4 inline-block text-primary hover:underline">← Geri Dön</Link>
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/restaurants" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">←</Link>
        <h2 className="text-xl font-black text-gray-800">Restoran Düzenle</h2>
        <span className={`badge text-xs ${restaurant.status === 'approved' ? 'bg-green-100 text-green-700' : restaurant.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
          {restaurant.status}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-700 border-b pb-2">Temel Bilgiler</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Restoran Adı</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Kategori</label>
            <input className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-600 block mb-1">Açıklama</label>
            <textarea className="input-field resize-none h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Adres</label>
            <input className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Şehir</label>
            <input className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Telefon</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>

        <h3 className="font-bold text-gray-700 border-b pb-2 pt-2">Teslimat & Sipariş Ayarları</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Teslimat Süresi (dk)</label>
            <input type="number" className="input-field" value={form.estimatedDeliveryTime} onChange={(e) => setForm({ ...form, estimatedDeliveryTime: parseInt(e.target.value) || 30 })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Min. Sipariş (₺)</label>
            <input type="number" className="input-field" value={form.minimumOrderAmount} onChange={(e) => setForm({ ...form, minimumOrderAmount: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Teslimat Ücreti (₺)</label>
            <input type="number" className="input-field" value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: parseFloat(e.target.value) || 0 })} />
          </div>
        </div>

        <h3 className="font-bold text-gray-700 border-b pb-2 pt-2">Görseller</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Logo URL</label>
            <input className="input-field" placeholder="https://..." value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
            {form.logoUrl && <img src={form.logoUrl} alt="logo" className="mt-2 w-16 h-16 rounded-xl object-cover border" />}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Kapak Fotoğrafı URL</label>
            <input className="input-field" placeholder="https://..." value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} />
            {form.coverImageUrl && <img src={form.coverImageUrl} alt="cover" className="mt-2 w-full h-28 rounded-xl object-cover border" />}
          </div>
        </div>

        {restaurant.owner && (
          <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
            👤 Sahip: <strong>{restaurant.owner.firstName} {restaurant.owner.lastName}</strong> — {restaurant.owner.email}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Link href="/admin/restaurants" className="btn-secondary flex-1 py-3 text-center">İptal</Link>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3 disabled:opacity-60">
            {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
          </button>
        </div>
      </div>

      {/* Menu Preview */}
      {restaurant.menuItems && restaurant.menuItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-700 mb-3">Menü ({restaurant.menuItems.length} ürün)</h3>
          <div className="space-y-2">
            {restaurant.menuItems.slice(0, 10).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-700">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-primary">{Number(item.price).toFixed(2)} ₺</span>
                  <span className={`badge text-xs ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    {item.isAvailable ? 'Mevcut' : 'Yok'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
