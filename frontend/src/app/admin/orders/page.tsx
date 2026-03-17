// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  restaurant_accepted: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-purple-100 text-purple-700',
  courier_assigned: 'bg-indigo-100 text-indigo-700',
  picked_up: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Bekliyor',
  restaurant_accepted: '✅ Onaylandı',
  preparing: '👨‍🍳 Hazırlanıyor',
  ready: '🎉 Hazır',
  courier_assigned: '🛵 Kurye Atandı',
  picked_up: '🛵 Yolda',
  delivered: '🏠 Teslim Edildi',
  cancelled: '❌ İptal',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    setError(false);
    adminApi.getAllOrders()
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => { setError(true); toast.error('Siparişler yüklenemedi.'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      const num = String(o.orderNumber ?? '').toLowerCase();
      const cust = `${o.customer?.firstName ?? ''} ${o.customer?.lastName ?? ''}`.toLowerCase();
      const rest = (o.restaurant?.name ?? '').toLowerCase();
      if (!num.includes(q) && !cust.includes(q) && !rest.includes(q)) return false;
    }
    return true;
  });

  const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-gray-800">Tüm Siparişler</h2>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input className="input-field pl-9 text-sm py-2.5 w-52" placeholder="Sipariş, müşteri, restoran..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input-field text-sm py-2.5 w-48" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tüm Durumlar</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : error ? (
          <div className="p-12 text-center">
            <span className="text-5xl">⚠️</span>
            <p className="text-lg font-semibold text-gray-600 mt-3">Bağlantı hatası</p>
            <p className="text-sm text-gray-400 mt-1">Sunucu yanıt vermiyor.</p>
            <button onClick={fetchOrders} className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">🔄 Tekrar Dene</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500">Sipariş</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Müşteri</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Restoran</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Kurye</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Tutar</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Durum</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-gray-800">#{order.orderNumber || order.id?.slice(0, 8)}</td>
                    <td className="px-4 py-3.5 text-gray-700">{order.customer ? `${order.customer.firstName ?? ''} ${order.customer.lastName ?? ''}`.trim() : '—'}</td>
                    <td className="px-4 py-3.5 text-gray-700">{order.restaurant?.name ?? '—'}</td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs">{order.courier ? `${order.courier.firstName ?? ''} ${order.courier.lastName ?? ''}`.trim() : <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3.5 font-bold text-primary">{Number(order.totalAmount ?? 0).toFixed(2)} ₺</td>
                    <td className="px-4 py-3.5">
                      <span className={`badge text-xs ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <span className="text-4xl">📦</span>
                <p className="mt-2">Sipariş bulunamadı.</p>
              </div>
            )}
          </div>
        )}
        <div className="px-5 py-3.5 border-t border-gray-100 text-sm text-gray-500">
          {filtered.length} sipariş gösteriliyor
        </div>
      </div>
    </div>
  );
}
