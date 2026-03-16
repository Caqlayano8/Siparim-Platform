'use client';

import Link from 'next/link';

const STATS = [
  { label: 'Toplam Restoran', value: '1.247', icon: '🏪', color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/restaurants' },
  { label: 'Toplam Kurye', value: '384', icon: '🛵', color: 'text-green-600', bg: 'bg-green-50', href: '/admin/couriers' },
  { label: 'Bugünün Siparişleri', value: '3.842', icon: '🛒', color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/orders' },
  { label: 'Bugünün Geliri', value: '₺428.940', icon: '💰', color: 'text-primary', bg: 'bg-primary-light', href: '/admin/orders' },
  { label: 'Onay Bekleyen Restoran', value: '12', icon: '⏳', color: 'text-yellow-600', bg: 'bg-yellow-50', href: '/admin/restaurants' },
  { label: 'Aktif Siparişler', value: '247', icon: '🔥', color: 'text-red-600', bg: 'bg-red-50', href: '/admin/orders' },
];

const RECENT_ORDERS = [
  { id: 'o1', number: '#4821', customer: 'Ahmet Y.', restaurant: 'Burger King', total: 189.90, status: 'on_way' },
  { id: 'o2', number: '#4820', customer: 'Fatma K.', restaurant: 'Pizza Hut', total: 249.00, status: 'preparing' },
  { id: 'o3', number: '#4819', customer: 'Mehmet A.', restaurant: 'Dönerci Ahmet', total: 94.50, status: 'delivered' },
  { id: 'o4', number: '#4818', customer: 'Zeynep B.', restaurant: 'Sushi Palace', total: 380.00, status: 'delivered' },
  { id: 'o5', number: '#4817', customer: 'Ali R.', restaurant: 'Kahve Dünyası', total: 67.80, status: 'cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-purple-100 text-purple-700',
  on_way: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Bekliyor',
  accepted: '✅ Onaylandı',
  preparing: '👨‍🍳 Hazırlanıyor',
  ready: '🎉 Hazır',
  on_way: '🛵 Yolda',
  delivered: '🏠 Teslim Edildi',
  cancelled: '❌ İptal',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow block"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bg} text-2xl mb-3`}>
              {stat.icon}
            </div>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Platform revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Platform Geliri (Bu Hafta)</h3>
            <span className="badge bg-green-100 text-green-700 text-xs">↑ 8.3% bu hafta</span>
          </div>
          <div className="h-44 flex items-end gap-3 px-2">
            {[38400, 52100, 41200, 68900, 57300, 72400, 72000].map((val, i) => {
              const days = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];
              const max = 72400;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/30 to-primary hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ height: `${(val / max) * 160}px` }}
                    title={`₺${val.toLocaleString('tr-TR')}`}
                  />
                  <span className="text-[10px] text-gray-400">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4">Hızlı Özet</h3>
          <div className="space-y-3">
            {[
              { label: 'Onay Bekleyen Restoran', value: 12, color: 'text-yellow-600', href: '/admin/restaurants' },
              { label: 'Onay Bekleyen Kurye', value: 7, color: 'text-blue-600', href: '/admin/couriers' },
              { label: 'Aktif Sipariş', value: 247, color: 'text-orange-600', href: '/admin/orders' },
              { label: 'Bu Ay Yeni Üye', value: 1243, color: 'text-green-600', href: '#' },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className={`font-bold text-lg ${item.color}`}>{item.value}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Son Siparişler</h3>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">Tümünü Gör</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Sipariş</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500">Müşteri</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500">Restoran</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500">Tutar</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{order.number}</td>
                  <td className="px-4 py-3.5 text-gray-600">{order.customer}</td>
                  <td className="px-4 py-3.5 text-gray-600">{order.restaurant}</td>
                  <td className="px-4 py-3.5 font-bold text-primary">{order.total.toFixed(2)} ₺</td>
                  <td className="px-4 py-3.5">
                    <span className={`badge text-xs ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
