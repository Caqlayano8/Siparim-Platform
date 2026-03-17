// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';

type TabType = 'pending' | 'approved' | 'rejected' | 'suspended';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  status: string;
  isOpen: boolean;
  rating: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
  logoUrl?: string;
  createdAt: string;
  owner?: { firstName?: string; lastName?: string; email?: string };
}

export default function AdminRestaurantsPage() {
  const [tab, setTab] = useState<TabType>('pending');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await adminApi.getRestaurants();
      setRestaurants(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError(true);
      toast.error('Restoranlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const currentList = restaurants.filter((r) => r.status === tab);

  const handleApprove = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await adminApi.approveRestaurant(id);
      setRestaurants((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approved' } : r));
      toast.success('Restoran onaylandı!');
    } catch {
      toast.error('İşlem başarısız.');
    } finally {
      setProcessingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    setProcessingIds((prev) => new Set(prev).add(rejectingId));
    try {
      await adminApi.rejectRestaurant(rejectingId, rejectReason);
      setRestaurants((prev) => prev.map((r) => r.id === rejectingId ? { ...r, status: 'rejected' } : r));
      toast.success('Restoran reddedildi.');
    } catch {
      toast.error('İşlem başarısız.');
    } finally {
      setProcessingIds((prev) => { const s = new Set(prev); s.delete(rejectingId!); return s; });
      setRejectingId(null);
      setRejectReason('');
    }
  };

  const handleToggle = async (r: Restaurant) => {
    setProcessingIds((prev) => new Set(prev).add(r.id));
    try {
      await adminApi.toggleRestaurant(r.id, !r.isOpen);
      setRestaurants((prev) => prev.map((x) => x.id === r.id ? { ...x, isOpen: !x.isOpen } : x));
      toast.success(r.isOpen ? 'Restoran kapatıldı.' : 'Restoran açıldı.');
    } catch {
      toast.error('İşlem başarısız.');
    } finally {
      setProcessingIds((prev) => { const s = new Set(prev); s.delete(r.id); return s; });
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm('Restoranı askıya almak istediğinizden emin misiniz?')) return;
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await adminApi.suspendRestaurant(id);
      setRestaurants((prev) => prev.map((r) => r.id === id ? { ...r, status: 'suspended' } : r));
      toast.success('Restoran askıya alındı.');
    } catch {
      toast.error('İşlem başarısız.');
    } finally {
      setProcessingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'pending', label: `⏳ Bekleyen (${restaurants.filter((r) => r.status === 'pending').length})` },
    { id: 'approved', label: `✅ Onaylı (${restaurants.filter((r) => r.status === 'approved').length})` },
    { id: 'rejected', label: `❌ Reddedilen (${restaurants.filter((r) => r.status === 'rejected').length})` },
    { id: 'suspended', label: `⏸ Askıya Alınan (${restaurants.filter((r) => r.status === 'suspended').length})` },
  ];

  return (
    <div className="space-y-5">
      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRejectingId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 z-10">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Reddetme Sebebi</h3>
            <textarea
              className="input-field resize-none h-24 text-sm mb-4"
              placeholder="Neden reddedildiğini belirtin..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectingId(null)} className="btn-secondary flex-1 py-2.5 text-sm">İptal</button>
              <button onClick={handleReject} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm transition-colors">Reddet</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-gray-800">Restoranlar</h2>
        <button onClick={fetchRestaurants} className="text-sm px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">🔄 Yenile</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`text-sm px-4 py-2 rounded-xl font-medium border-2 transition-all ${tab === t.id ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}</div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm text-center py-16">
          <span className="text-5xl">⚠️</span>
          <p className="text-lg font-semibold text-gray-600 mt-3">Bağlantı hatası</p>
          <p className="text-sm text-gray-400 mt-1">Sunucu yanıt vermiyor. Backend'in çalışır durumda olduğundan emin olun.</p>
          <button onClick={fetchRestaurants} className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">🔄 Tekrar Dene</button>
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm text-center py-16">
          <span className="text-5xl">🎉</span>
          <p className="text-lg font-semibold text-gray-600 mt-3">Bu kategoride restoran yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-100 flex items-center justify-center text-2xl">
                {r.logoUrl ? <img src={r.logoUrl} alt={r.name} className="w-full h-full object-cover" /> : '🏪'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-800">{r.name}</h3>
                  <span className="badge bg-gray-100 text-gray-500 text-xs">{r.category}</span>
                  {r.status === 'approved' && (
                    <span className={`badge text-xs ${r.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {r.isOpen ? '🟢 Açık' : '🔴 Kapalı'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-0.5">📍 {r.address}, {r.city}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1.5">
                  <span>🕐 {r.estimatedDeliveryTime} dk</span>
                  <span>🛵 {Number(r.deliveryFee).toFixed(2)} ₺</span>
                  <span>💸 Min. {Number(r.minimumOrderAmount).toFixed(0)} ₺</span>
                  <span>📅 {new Date(r.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                {r.owner && (
                  <p className="text-xs text-gray-400 mt-1">👤 {r.owner.firstName} {r.owner.lastName} — {r.owner.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0 items-end">
                {tab === 'pending' && (
                  <>
                    <button onClick={() => setRejectingId(r.id)} disabled={processingIds.has(r.id)} className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50">❌ Reddet</button>
                    <button onClick={() => handleApprove(r.id)} disabled={processingIds.has(r.id)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">✅ Onayla</button>
                  </>
                )}
                {tab === 'approved' && (
                  <>
                    <button onClick={() => handleToggle(r)} disabled={processingIds.has(r.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${r.isOpen ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                      {r.isOpen ? '🔴 Kapat' : '🟢 Aç'}
                    </button>
                    <button onClick={() => handleSuspend(r.id)} disabled={processingIds.has(r.id)} className="px-4 py-2 border-2 border-orange-300 text-orange-600 rounded-xl text-sm font-semibold hover:bg-orange-50 transition-colors disabled:opacity-50">⏸ Askıya Al</button>
                    <Link href={`/admin/restaurants/${r.id}`} className="px-4 py-2 border-2 border-blue-300 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors text-center">✏️ Düzenle</Link>
                  </>
                )}
                {(tab === 'rejected' || tab === 'suspended') && (
                  <>
                    <button onClick={() => handleApprove(r.id)} disabled={processingIds.has(r.id)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">✅ Onayla</button>
                    <Link href={`/admin/restaurants/${r.id}`} className="px-4 py-2 border-2 border-blue-300 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors text-center">✏️ Düzenle</Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
