'use client';

import { useState } from 'react';
import Link from 'next/link';
import { restaurantsApi } from '@/lib/api';

const STATS = [
  { label: 'Bugünün Siparişleri', value: '23', icon: '🛒', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Bugünün Geliri', value: '₺2.847', icon: '💰', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Bekleyen Sipariş', value: '4', icon: '⏳', color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Ortalama Puan', value: '4.8 ⭐', icon: '⭐', color: 'text-yellow-600', bg: 'bg-yellow-50' },
];

const RECENT_ORDERS = [
  { id: 'o1', orderNumber: '#1023', customer: 'Ahmet Y.', total: 189.90, status: 'preparing', time: '5 dk önce' },
  { id: 'o2', orderNumber: '#1022', customer: 'Fatma K.', total: 94.50, status: 'on_way', time: '18 dk önce' },
  { id: 'o3', orderNumber: '#1021', customer: 'Mehmet A.', total: 234.00, status: 'delivered', time: '32 dk önce' },
  { id: 'o4', orderNumber: '#1020', customer: 'Zeynep B.', total: 67.80, status: 'delivered', time: '55 dk önce' },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: '⏳ Bekliyor', color: 'bg-yellow-100 text-yellow-700' },
  accepted: { label: '✅ Onaylandı', color: 'bg-blue-100 text-blue-700' },
  preparing: { label: '👨‍🍳 Hazırlanıyor', color: 'bg-orange-100 text-orange-700' },
  ready: { label: '🎉 Hazır', color: 'bg-purple-100 text-purple-700' },
  on_way: { label: '🛵 Yolda', color: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: '🏠 Teslim Edildi', color: 'bg-green-100 text-green-700' },
};

export default function RestaurantDashboardPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-6">
      {/* Open/Close toggle */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800">Restoran Durumu</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {isOpen ? '🟢 Restoranınız sipariş kabul ediyor.' : '🔴 Restoranınız kapalı.'}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isOpen ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${isOpen ? 'translate-x-7' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 border-l-transparent hover:shadow-md transition-shadow`}>
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.bg} text-xl mb-3`}>
              {stat.icon}
            </div>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart placeholder + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue chart placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Günlük Gelir (Bu Hafta)</h3>
            <span className="badge bg-green-100 text-green-700 text-xs">↑ 12% bu hafta</span>
          </div>
          <div className="h-40 flex items-end gap-3 px-2">
            {[420, 680, 320, 890, 560, 750, 847].map((val, i) => {
              const days = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];
              const max = 890;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg bg-primary/20 hover:bg-primary transition-colors cursor-pointer" style={{ height: `${(val / max) * 130}px` }} title={`${val} ₺`} />
                  <span className="text-[10px] text-gray-400">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4">Hızlı İşlemler</h3>
          <div className="space-y-2">
            <Link href="/restaurant-panel/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-lg">🛒</span>
              <div>
                <p className="font-medium text-sm text-gray-700">Siparişleri Görüntüle</p>
                <p className="text-xs text-orange font-semibold">4 bekliyor</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/restaurant-panel/menu" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-lg">🍽️</span>
              <div>
                <p className="font-medium text-sm text-gray-700">Menü Düzenle</p>
                <p className="text-xs text-gray-400">24 ürün</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/restaurant-panel/earnings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-lg">💰</span>
              <div>
                <p className="font-medium text-sm text-gray-700">Kazanç Raporu</p>
                <p className="text-xs text-gray-400">Bu ay: ₺18.430</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Son Siparişler</h3>
          <Link href="/restaurant-panel/orders" className="text-sm text-primary hover:underline">Tümünü Gör</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {RECENT_ORDERS.map((order) => {
            const st = STATUS_LABELS[order.status];
            return (
              <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-800">{order.orderNumber}</span>
                    <span className="text-xs text-gray-400">{order.customer}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{order.time}</p>
                </div>
                <span className={`badge text-xs ${st.color}`}>{st.label}</span>
                <span className="font-bold text-sm text-primary">{order.total.toFixed(2)} ₺</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
