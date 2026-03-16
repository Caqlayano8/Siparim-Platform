'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';
import { Courier } from '@/types';

const MOCK_PENDING_COURIERS: Courier[] = [
  { id: 'c10', name: 'Burak Yıldız', email: 'burak@mail.com', phone: '0532 111 2233', isApproved: false, isActive: false, vehicleType: 'motorcycle', createdAt: new Date(Date.now() - 43200000).toISOString() },
  { id: 'c11', name: 'Can Demir', email: 'can@mail.com', phone: '0542 222 3344', isApproved: false, isActive: false, vehicleType: 'bicycle', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'c12', name: 'Emre Kılıç', email: 'emre@mail.com', phone: '0552 333 4455', isApproved: false, isActive: false, vehicleType: 'motorcycle', createdAt: new Date(Date.now() - 21600000).toISOString() },
];

const MOCK_APPROVED_COURIERS: Courier[] = [
  { id: 'c1', name: 'Mehmet Korkmaz', email: 'mehmet@mail.com', phone: '0555 444 5566', isApproved: true, isActive: true, vehicleType: 'motorcycle', rating: 4.8, totalDeliveries: 1240, createdAt: new Date(Date.now() - 15552000000).toISOString() },
  { id: 'c2', name: 'Ali Şahin', email: 'ali@mail.com', phone: '0565 555 6677', isApproved: true, isActive: false, vehicleType: 'bicycle', rating: 4.6, totalDeliveries: 856, createdAt: new Date(Date.now() - 20736000000).toISOString() },
  { id: 'c3', name: 'Kadir Polat', email: 'kadir@mail.com', phone: '0575 666 7788', isApproved: true, isActive: true, vehicleType: 'car', rating: 4.9, totalDeliveries: 2100, createdAt: new Date(Date.now() - 31104000000).toISOString() },
];

const VEHICLE_LABELS: Record<string, { label: string; icon: string }> = {
  motorcycle: { label: 'Motor', icon: '🏍️' },
  bicycle: { label: 'Bisiklet', icon: '🚲' },
  car: { label: 'Araba', icon: '🚗' },
};

export default function AdminCouriersPage() {
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [pending, setPending] = useState(MOCK_PENDING_COURIERS);
  const [approved, setApproved] = useState(MOCK_APPROVED_COURIERS);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleApprove = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await adminApi.approveCourier(id);
      const courier = pending.find((c) => c.id === id)!;
      setPending((prev) => prev.filter((c) => c.id !== id));
      setApproved((prev) => [{ ...courier, isApproved: true, isActive: true }, ...prev]);
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
      setPending((prev) => prev.filter((c) => c.id !== id));
      toast.success('Kurye reddedildi.');
    } catch {
      toast.error('İşlem başarısız.');
    } finally {
      setProcessingIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const list = tab === 'pending' ? pending : approved;

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

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm text-center py-16">
          <span className="text-5xl">🛵</span>
          <p className="text-lg font-semibold text-gray-600 mt-3">Bekleyen kurye başvurusu yok</p>
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
                  const vehicle = VEHICLE_LABELS[courier.vehicleType];
                  return (
                    <tr key={courier.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {courier.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{courier.name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(courier.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="badge bg-gray-100 text-gray-600 text-xs">
                          {vehicle.icon} {vehicle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-gray-700 text-xs">{courier.email}</p>
                        <p className="text-gray-400 text-xs">{courier.phone}</p>
                      </td>
                      {tab === 'approved' && (
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-gray-700">⭐ {courier.rating?.toFixed(1)}</p>
                          <p className="text-xs text-gray-400">{courier.totalDeliveries?.toLocaleString()} teslimat</p>
                        </td>
                      )}
                      <td className="px-4 py-3.5">
                        <span className={`badge text-xs ${courier.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {courier.isActive ? '🟢 Aktif' : '⚫ Pasif'}
                        </span>
                      </td>
                      {tab === 'pending' && (
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReject(courier.id)}
                              disabled={processingIds.has(courier.id)}
                              className="px-3 py-1.5 border-2 border-red-200 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              ❌ Reddet
                            </button>
                            <button
                              onClick={() => handleApprove(courier.id)}
                              disabled={processingIds.has(courier.id)}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              ✅ Onayla
                            </button>
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
