// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';

interface Courier {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  status: string;
  isOnline?: boolean;
  vehicleType?: string;
  rating?: number;
  totalDeliveries?: number;
  createdAt: string;
}

const VEHICLE_LABELS: Record<string, { label: string; icon: string }> = {
  motorcycle: { label: 'Motor', icon: '🏍️' },
  bicycle: { label: 'Bisiklet', icon: '🚲' },
  car: { label: 'Araba', icon: '🚗' },
};

export default function AdminCouriersPage() {
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchCouriers = () => {
    setLoading(true);
    setError(false);
    adminApi.getAllCouriers()
      .then((res) => setCouriers(Array.isArray(res.data) ? res.data : []))
      .catch(() => { setError(true); toast.error('Kuryeler yüklenemedi.'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  const pending = couriers.filter((c) => c.status === 'pending');
  const approved = couriers.filter((c) => c.status === 'approved');
  const list = tab === 'pending' ? pending : approved;

  const getName = (c: Courier) => (c.name ?? `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim()) || '—';

  const handleApprove = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await adminApi.approveCourier(id);
      setCouriers((prev) => prev.map((c) => c.id === id ? { ...c, status: 'approved' } : c));
      toast.success('Kurye onaylandı!');
    } catch {
      toast.error('İşlem başarısız.');
    } finally {
      setProcessingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Kuryeyi reddetmek istediğinizden emin misiniz?')) return;
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await adminApi.rejectCourier(id);
      setCouriers((prev) => prev.map((c) => c.id === id ? { ...c, status: 'rejected' } : c));
      toast.success('Kurye reddedildi.');
    } catch {
      toast.error('İşlem başarısız.');
    } finally {
      setProcessingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-800">Kuryeler</h2>
        <div className="flex gap-2">
          {[
            { id: 'pending', label: `⏳ Bekleyen (${pending.length})` },
            { id: 'approved', label: `✅ Aktif (${approved.length})` },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as 'pending' | 'approved')} className={`text-sm px-4 py-2 rounded-xl font-medium border-2 transition-all ${tab === t.id ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-600'}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl h-48 animate-pulse" />
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm text-center py-16">
          <span className="text-5xl">⚠️</span>
          <p className="text-lg font-semibold text-gray-600 mt-3">Bağlantı hatası</p>
          <p className="text-sm text-gray-400 mt-1">Sunucu yanıt vermiyor.</p>
          <button onClick={fetchCouriers} className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">🔄 Tekrar Dene</button>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm text-center py-16">
          <span className="text-5xl">🛵</span>
          <p className="text-lg font-semibold text-gray-600 mt-3">{tab === 'pending' ? 'Bekleyen kurye başvurusu yok' : 'Aktif kurye yok'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Kurye</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Araç</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">İletişim</th>
                  {tab === 'approved' && <th className="text-left px-4 py-3.5 font-semibold text-gray-500">İstatistik</th>}
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Durum</th>
                  {tab === 'pending' && <th className="text-right px-5 py-3.5 font-semibold text-gray-500">İşlem</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map((courier) => {
                  const vehicle = VEHICLE_LABELS[courier.vehicleType ?? ''];
                  return (
                    <tr key={courier.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {getName(courier).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{getName(courier)}</p>
                            <p className="text-xs text-gray-400">{new Date(courier.createdAt).toLocaleDateString('tr-TR')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {vehicle ? (
                          <span className="badge bg-gray-100 text-gray-600 text-xs">{vehicle.icon} {vehicle.label}</span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-gray-700 text-xs">{courier.email}</p>
                        <p className="text-gray-400 text-xs">{courier.phone ?? '—'}</p>
                      </td>
                      {tab === 'approved' && (
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-gray-700">⭐ {courier.rating?.toFixed(1) ?? '—'}</p>
                          <p className="text-xs text-gray-400">{courier.totalDeliveries?.toLocaleString() ?? 0} teslimat</p>
                        </td>
                      )}
                      <td className="px-4 py-3.5">
                        <span className={`badge text-xs ${courier.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {courier.isOnline ? '🟢 Çevrimiçi' : '⚫ Çevrimdışı'}
                        </span>
                      </td>
                      {tab === 'pending' && (
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleReject(courier.id)} disabled={processingIds.has(courier.id)} className="px-3 py-1.5 border-2 border-red-200 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50">❌ Reddet</button>
                            <button onClick={() => handleApprove(courier.id)} disabled={processingIds.has(courier.id)} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">✅ Onayla</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
