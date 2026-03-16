'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { adminApi } from '@/lib/api';
import { Restaurant } from '@/types';

type TabType = 'pending' | 'approved' | 'rejected';

const MOCK_PENDING: Restaurant[] = [
  { id: 'r10', name: 'Kebapçı Hüseyin', logo: 'https://placehold.co/60x60/8b4513/white?text=KH', coverImage: '', category: 'Döner', categoryEmoji: '🌯', rating: 0, reviewCount: 0, deliveryTime: 30, deliveryFee: 10, minOrder: 50, isOpen: false, isApproved: false, address: 'Fatih Mah. No:12', district: 'Fatih', city: 'İstanbul', ownerId: 'u10', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'r11', name: 'Sushi Tokyo', logo: 'https://placehold.co/60x60/1a1a2e/white?text=ST', coverImage: '', category: 'Sushi', categoryEmoji: '🍱', rating: 0, reviewCount: 0, deliveryTime: 45, deliveryFee: 20, minOrder: 120, isOpen: false, isApproved: false, address: 'Nişantaşı', district: 'Şişli', city: 'İstanbul', ownerId: 'u11', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'r12', name: 'Çorbacı Mehmet', logo: 'https://placehold.co/60x60/e8231a/white?text=ÇM', coverImage: '', category: 'Çorba', categoryEmoji: '🍲', rating: 0, reviewCount: 0, deliveryTime: 25, deliveryFee: 8, minOrder: 40, isOpen: false, isApproved: false, address: 'Ümraniye', district: 'Ümraniye', city: 'İstanbul', ownerId: 'u12', createdAt: new Date(Date.now() - 43200000).toISOString() },
];

const MOCK_APPROVED: Restaurant[] = [
  { id: 'r1', name: 'Burger King', logo: 'https://placehold.co/60x60/e8231a/white?text=BK', coverImage: '', category: 'Burger', categoryEmoji: '🍔', rating: 4.5, reviewCount: 2341, deliveryTime: 25, deliveryFee: 9.99, minOrder: 50, isOpen: true, isApproved: true, address: 'Bağcılar', district: 'Bağcılar', city: 'İstanbul', ownerId: 'o1', createdAt: new Date(Date.now() - 2592000000).toISOString() },
  { id: 'r2', name: 'Pizza Hut', logo: 'https://placehold.co/60x60/ff8c00/white?text=PH', coverImage: '', category: 'Pizza', categoryEmoji: '🍕', rating: 4.3, reviewCount: 1876, deliveryTime: 35, deliveryFee: 14.99, minOrder: 80, isOpen: true, isApproved: true, address: 'Kadıköy', district: 'Kadıköy', city: 'İstanbul', ownerId: 'o2', createdAt: new Date(Date.now() - 5184000000).toISOString() },
];

export default function AdminRestaurantsPage() {
  const [tab, setTab] = useState<TabType>('pending');
  const [pending, setPending] = useState(MOCK_PENDING);
  const [approved, setApproved] = useState(MOCK_APPROVED);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleApprove = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await adminApi.approveRestaurant(id);
      const restaurant = pending.find((r) => r.id === id)!;
      setPending((prev) => prev.filter((r) => r.id !== id));
      setApproved((prev) => [{ ...restaurant, isApproved: true }, ...prev]);
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
      setPending((prev) => prev.filter((r) => r.id !== rejectingId));
      toast.success('Restoran reddedildi.');
    } catch {
      toast.error('İşlem başarısız.');
    } finally {
      setProcessingIds((prev) => { const s = new Set(prev); s.delete(rejectingId); return s; });
      setRejectingId(null);
      setRejectReason('');
    }
  };

  const currentList = tab === 'pending' ? pending : tab === 'approved' ? approved : [];

  return (
    <div className="space-y-5">
      {/* Reject modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRejectingId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 z-10 animate-fade-in">
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

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-800">Restoranlar</h2>
        <div className="flex gap-2">
          {[
            { id: 'pending', label: `⏳ Bekleyen (${pending.length})` },
            { id: 'approved', label: `✅ Onaylı (${approved.length})` },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as TabType)} className={`text-sm px-4 py-2 rounded-xl font-medium border-2 transition-all ${tab === t.id ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-600'}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {currentList.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm text-center py-16">
          <span className="text-5xl">🎉</span>
          <p className="text-lg font-semibold text-gray-600 mt-3">Bekleyen istek yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4">
              {r.logo && (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                  <Image src={r.logo} alt={r.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-800">{r.name}</h3>
                  <span className="badge bg-gray-100 text-gray-500 text-xs">{r.categoryEmoji} {r.category}</span>
                </div>
                <p className="text-sm text-gray-400 mt-0.5">📍 {r.address}, {r.district}, {r.city}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1.5">
                  <span>🕐 {r.deliveryTime} dk</span>
                  <span>🛵 {r.deliveryFee} ₺</span>
                  <span>💸 Min. {r.minOrder} ₺</span>
                  <span>📅 {new Date(r.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              {tab === 'pending' && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setRejectingId(r.id)}
                    disabled={processingIds.has(r.id)}
                    className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    ❌ Reddet
                  </button>
                  <button
                    onClick={() => handleApprove(r.id)}
                    disabled={processingIds.has(r.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    ✅ Onayla
                  </button>
                </div>
              )}
              {tab === 'approved' && (
                <span className="badge bg-green-100 text-green-700">✅ Onaylı</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
