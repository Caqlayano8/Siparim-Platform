// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [courierEnabled, setCourierEnabled] = useState(true);
  const [savingCourier, setSavingCourier] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('courier_service_enabled');
    if (stored !== null) setCourierEnabled(stored === 'true');

    Promise.all([
      adminApi.getStats().catch(() => null),
      adminApi.getAllOrders({ page: 1 }).catch(() => null),
    ]).then(([statsRes, ordersRes]) => {
      if (statsRes?.data) setStats(statsRes.data);
      if (ordersRes?.data) setRecentOrders(Array.isArray(ordersRes.data) ? ordersRes.data.slice(0, 5) : []);
    }).finally(() => setLoading(false));
  }, []);

  const handleCourierToggle = async () => {
    setSavingCourier(true);
    try {
      const newVal = !courierEnabled;
      await adminApi.updateSettings({ courierServiceEnabled: newVal });
      localStorage.setItem('courier_service_enabled', String(newVal));
      setCourierEnabled(newVal);
      toast.success(newVal ? 'Kurye servisi aktif edildi' : 'Kurye servisi durduruldu');
    } catch {
      toast.error('Ayar kaydedilemedi');
    } finally {
      setSavingCourier(false);
    }
  };

  const statCards = stats ? [
    { label: 'Toplam Restoran', value: stats.restaurants?.total ?? 0, icon: '🏪', color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/restaurants' },
    { label: 'Toplam Kurye', value: stats.couriers?.total ?? 0, icon: '🛵', color: 'text-green-600', bg: 'bg-green-50', href: '/admin/couriers' },
    { label: 'Toplam Sipariş', value: stats.orders?.total ?? 0, icon: '📦', color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/orders' },
    { label: 'Toplam Kullanıcı', value: stats.users?.total ?? 0, icon: '👥', color: 'text-primary', bg: 'bg-primary-light', href: '/admin/users' },
    { label: 'Onay Bekleyen Restoran', value: stats.restaurants?.pending ?? 0, icon: '⏳', color: 'text-yellow-600', bg: 'bg-yellow-50', href: '/admin/restaurants' },
    { label: 'Onay Bekleyen Kurye', value: stats.couriers?.pending ?? 0, icon: '🔔', color: 'text-red-600', bg: 'bg-red-50', href: '/admin/couriers' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Courier Service Toggle */}
      <div className={`rounded-2xl p-5 shadow-sm flex items-center justify-between ${courierEnabled ? 'bg-white' : 'bg-yellow-50 border-2 border-yellow-300'}`}>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">🛵 Kurye Servisi</h3>
          <p className={`text-sm mt-0.5 ${courierEnabled ? 'text-green-600' : 'text-yellow-700 font-semibold'}`}>
            {courierEnabled ? '✅ Kurye servisi aktif - Siparişler alınıyor' : '⚠️ Kurye servisi devre dışı - Siparişler alınamaz'}
          </p>
        </div>
        <button
          onClick={handleCourierToggle}
          disabled={savingCourier}
          className={`relative w-16 h-8 rounded-full transition-colors duration-300 disabled:opacity-60 ${courierEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${courierEnabled ? 'translate-x-8' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 shadow-sm h-28 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow block">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bg} text-2xl mb-3`}>
                {stat.icon}
              </div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Recent orders table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Son Siparişler</h3>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">Tümünü Gör</Link>
        </div>
        {recentOrders.length === 0 && !loading ? (
          <div className="text-center py-10 text-gray-400"><span className="text-3xl">📦</span><p className="mt-2 text-sm">Henüz sipariş yok.</p></div>
        ) : (
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-gray-800">#{order.orderNumber || order.id?.slice(0, 8)}</td>
                    <td className="px-4 py-3.5 text-gray-600">{order.customer?.firstName ? `${order.customer.firstName} ${order.customer.lastName ?? ''}`.trim() : '—'}</td>
                    <td className="px-4 py-3.5 text-gray-600">{order.restaurant?.name ?? '—'}</td>
                    <td className="px-4 py-3.5 font-bold text-primary">{Number(order.totalAmount ?? 0).toFixed(2)} ₺</td>
                    <td className="px-4 py-3.5">
                      <span className={`badge text-xs ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
