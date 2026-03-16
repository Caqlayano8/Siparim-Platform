'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-purple-100 text-purple-700',
  on_way: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  rejected: 'bg-red-100 text-red-600',
};

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Bekliyor',
  accepted: '✅ Onaylandı',
  preparing: '👨‍🍳 Hazırlanıyor',
  ready: '🎉 Hazır',
  on_way: '🛵 Yolda',
  delivered: '🏠 Teslim Edildi',
  cancelled: '❌ İptal',
  rejected: '🚫 Reddedildi',
};

const MOCK_ORDERS: (Order & { restaurantName: string; customerName: string })[] = [
  { id: 'ao1', orderNumber: '#4821', customerId: 'u1', customerName: 'Ahmet Yılmaz', restaurantId: 'r1', restaurantName: 'Burger King', courierName: 'Mehmet K.', items: [{ menuItemId: 'm1', name: 'Whopper', price: 89.90, quantity: 2 }], subtotal: 179.80, deliveryFee: 9.99, discount: 0, total: 189.79, status: 'on_way', address: { id: 'a1', title: 'Ev', fullAddress: 'Kadıköy', district: 'Kadıköy', city: 'İstanbul' }, statusHistory: [], createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ao2', orderNumber: '#4820', customerId: 'u2', customerName: 'Fatma Kaya', restaurantId: 'r2', restaurantName: 'Pizza Hut', courierName: undefined, items: [{ menuItemId: 'm20', name: 'Margarita Pizza', price: 149.90, quantity: 1 }], subtotal: 149.90, deliveryFee: 14.99, discount: 0, total: 164.89, status: 'preparing', address: { id: 'a2', title: 'İş', fullAddress: 'Levent', district: 'Beşiktaş', city: 'İstanbul' }, statusHistory: [], createdAt: new Date(Date.now() - 1800000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ao3', orderNumber: '#4819', customerId: 'u3', customerName: 'Mehmet Arslan', restaurantId: 'r3', restaurantName: 'Dönerci Ahmet', courierName: 'Ali Ş.', items: [{ menuItemId: 'm30', name: 'Döner Dürüm', price: 69.90, quantity: 3 }], subtotal: 209.70, deliveryFee: 7.99, discount: 0, total: 217.69, status: 'delivered', address: { id: 'a3', title: 'Ev', fullAddress: 'Şişli', district: 'Şişli', city: 'İstanbul' }, statusHistory: [], createdAt: new Date(Date.now() - 7200000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ao4', orderNumber: '#4818', customerId: 'u4', customerName: 'Zeynep Başaran', restaurantId: 'r4', restaurantName: 'Sushi Palace', courierName: 'Kadir P.', items: [{ menuItemId: 'm40', name: 'Sushi Mix', price: 190, quantity: 2 }], subtotal: 380, deliveryFee: 19.99, discount: 0, total: 399.99, status: 'delivered', address: { id: 'a4', title: 'Ev', fullAddress: 'Nişantaşı', district: 'Şişli', city: 'İstanbul' }, statusHistory: [], createdAt: new Date(Date.now() - 10800000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'ao5', orderNumber: '#4817', customerId: 'u5', customerName: 'Ali Rıza', restaurantId: 'r5', restaurantName: 'Kahve Dünyası', courierName: undefined, items: [{ menuItemId: 'm50', name: 'Latte', price: 34, quantity: 2 }], subtotal: 68, deliveryFee: 5.99, discount: 5, total: 68.99, status: 'cancelled', address: { id: 'a5', title: 'İş', fullAddress: 'Bağcılar', district: 'Bağcılar', city: 'İstanbul' }, statusHistory: [], createdAt: new Date(Date.now() - 14400000).toISOString(), updatedAt: new Date().toISOString() },
];

export default function AdminOrdersPage() {
  const [orders] = useState(MOCK_ORDERS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (search && !o.orderNumber.includes(search) && !o.customerName.toLowerCase().includes(search.toLowerCase()) && !o.restaurantName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const STATUS_OPTIONS = ['all', 'pending', 'accepted', 'preparing', 'ready', 'on_way', 'delivered', 'cancelled'];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-gray-800">Tüm Siparişler</h2>
        <div className="flex gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input className="input-field pl-9 text-sm py-2.5 w-52" placeholder="Sipariş, müşteri, restoran..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input-field text-sm py-2.5 w-48" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tüm Durumlar</option>
            {STATUS_OPTIONS.slice(1).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
                  <td className="px-5 py-3.5 font-bold text-gray-800">{order.orderNumber}</td>
                  <td className="px-4 py-3.5 text-gray-700">{order.customerName}</td>
                  <td className="px-4 py-3.5 text-gray-700">{order.restaurantName}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs">
                    {order.courierName ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-primary">{order.total.toFixed(2)} ₺</td>
                  <td className="px-4 py-3.5">
                    <span className={`badge text-xs ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
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
        {/* Pagination placeholder */}
        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>{filtered.length} sipariş gösteriliyor</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40" disabled>←</button>
            <button className="px-3 py-1.5 rounded-lg bg-primary text-white font-semibold">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
