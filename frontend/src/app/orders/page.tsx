'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ordersApi } from '@/lib/api';
import { Order, OrderStatus } from '@/types';

const STATUS_LABELS: Record<OrderStatus, { label: string; icon: string; color: string }> = {
  pending: { label: 'Onay Bekleniyor', icon: '⏳', color: 'bg-yellow-100 text-yellow-700' },
  accepted: { label: 'Onaylandı', icon: '✅', color: 'bg-blue-100 text-blue-700' },
  preparing: { label: 'Hazırlanıyor', icon: '👨‍🍳', color: 'bg-orange-100 text-orange-700' },
  ready: { label: 'Hazır', icon: '🎉', color: 'bg-purple-100 text-purple-700' },
  on_way: { label: 'Yolda', icon: '🛵', color: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Teslim Edildi', icon: '🏠', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'İptal Edildi', icon: '❌', color: 'bg-red-100 text-red-600' },
  rejected: { label: 'Reddedildi', icon: '🚫', color: 'bg-red-100 text-red-600' },
};

// Mock orders
const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: '#1001',
    customerId: 'u1',
    restaurantId: '1',
    restaurantName: 'Burger King',
    items: [
      { menuItemId: 'm1', name: 'Whopper', price: 89.90, quantity: 2 },
      { menuItemId: 'm10', name: 'Cola', price: 24.90, quantity: 2 },
    ],
    subtotal: 229.60,
    deliveryFee: 9.99,
    discount: 0,
    total: 239.59,
    status: 'delivered',
    address: { id: 'a1', title: 'Ev', fullAddress: 'Örnek Mah. No:5', district: 'Kadıköy', city: 'İstanbul' },
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { status: 'accepted', timestamp: new Date(Date.now() - 3200000).toISOString() },
      { status: 'preparing', timestamp: new Date(Date.now() - 2800000).toISOString() },
      { status: 'on_way', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { status: 'delivered', timestamp: new Date(Date.now() - 900000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'ord-2',
    orderNumber: '#1002',
    customerId: 'u1',
    restaurantId: '2',
    restaurantName: 'Pizza Hut',
    items: [
      { menuItemId: 'm20', name: 'Margarita Pizza', price: 149.90, quantity: 1 },
    ],
    subtotal: 149.90,
    deliveryFee: 14.99,
    discount: 20,
    total: 144.89,
    status: 'on_way',
    address: { id: 'a1', title: 'Ev', fullAddress: 'Örnek Mah. No:5', district: 'Kadıköy', city: 'İstanbul' },
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { status: 'accepted', timestamp: new Date(Date.now() - 1600000).toISOString() },
      { status: 'preparing', timestamp: new Date(Date.now() - 1200000).toISOString() },
      { status: 'on_way', timestamp: new Date(Date.now() - 600000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'ord-3',
    orderNumber: '#1003',
    customerId: 'u1',
    restaurantId: '3',
    restaurantName: 'Dönerci Ahmet',
    items: [
      { menuItemId: 'm30', name: 'Döner Dürüm', price: 69.90, quantity: 3 },
    ],
    subtotal: 209.70,
    deliveryFee: 7.99,
    discount: 0,
    total: 217.69,
    status: 'cancelled',
    address: { id: 'a1', title: 'İş', fullAddress: 'İş Merkezi No:10', district: 'Beşiktaş', city: 'İstanbul' },
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { status: 'cancelled', timestamp: new Date(Date.now() - 85000000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 85000000).toISOString(),
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  const ACTIVE_STATUSES: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'on_way'];

  const filtered = orders.filter((o) => {
    if (filter === 'active') return ACTIVE_STATUSES.includes(o.status);
    if (filter === 'completed') return o.status === 'delivered';
    if (filter === 'cancelled') return o.status === 'cancelled' || o.status === 'rejected';
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-gray-800 mb-6">Siparişlerim</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'active', label: '🔥 Aktif' },
            { id: 'completed', label: '✅ Tamamlanan' },
            { id: 'cancelled', label: '❌ İptal' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                filter === f.id
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl">📦</span>
            <p className="text-xl font-semibold text-gray-600 mt-4">Sipariş bulunamadı</p>
            <Link href="/restaurants" className="btn-primary inline-block mt-6 text-sm">
              Sipariş Ver
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const st = STATUS_LABELS[order.status];
              const isActive = ACTIVE_STATUSES.includes(order.status);
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-800">{order.restaurantName}</span>
                        <span className="text-gray-400 text-sm">{order.orderNumber}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric', month: 'long', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className={`badge ${st.color} flex-shrink-0`}>
                      {st.icon} {st.label}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 mb-3">
                    {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{order.total.toFixed(2)} ₺</span>
                    {isActive && (
                      <span className="flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary-light px-3 py-1.5 rounded-lg">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        Takip Et
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
