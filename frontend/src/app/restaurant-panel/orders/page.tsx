// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { ordersApi } from '@/lib/api';
import { getSocket, SOCKET_EVENTS, joinRestaurantRoom } from '@/lib/socket';
import { Order, OrderStatus } from '@/types';

// Mock incoming orders
const MOCK_ORDERS: Order[] = [
  {
    id: 'r-ord-1',
    orderNumber: '#1024',
    customerId: 'u5',
    customerName: 'Ayşe Kaya',
    restaurantId: 'r1',
    items: [
      { menuItemId: 'm1', name: 'Whopper', price: 89.90, quantity: 2 },
      { menuItemId: 'm10', name: 'Cola', price: 24.90, quantity: 2 },
    ],
    subtotal: 229.60,
    deliveryFee: 9.99,
    discount: 0,
    total: 239.59,
    status: 'pending',
    address: { id: 'a1', title: 'Ev', fullAddress: 'Bağdat Caddesi No:145 D:7', district: 'Kadıköy', city: 'İstanbul' },
    statusHistory: [{ status: 'pending', timestamp: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'r-ord-2',
    orderNumber: '#1023',
    customerId: 'u3',
    customerName: 'Mehmet Öztürk',
    restaurantId: 'r1',
    items: [
      { menuItemId: 'm6', name: 'Whopper Menü', price: 129.90, quantity: 1 },
    ],
    subtotal: 129.90,
    deliveryFee: 9.99,
    discount: 0,
    total: 139.89,
    status: 'accepted',
    address: { id: 'a2', title: 'İş', fullAddress: 'Levent Mah. İş Kuleleri No:1', district: 'Beşiktaş', city: 'İstanbul' },
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 300000).toISOString() },
      { status: 'accepted', timestamp: new Date(Date.now() - 240000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 300000).toISOString(),
    updatedAt: new Date(Date.now() - 240000).toISOString(),
  },
  {
    id: 'r-ord-3',
    orderNumber: '#1022',
    customerId: 'u6',
    customerName: 'Zeynep Arslan',
    restaurantId: 'r1',
    items: [
      { menuItemId: 'm4', name: 'Crispy Chicken', price: 79.90, quantity: 2 },
      { menuItemId: 'm8', name: 'Soğan Halkası', price: 39.90, quantity: 1 },
    ],
    subtotal: 199.70,
    deliveryFee: 9.99,
    discount: 0,
    total: 209.69,
    status: 'preparing',
    address: { id: 'a3', title: 'Ev', fullAddress: 'Nişantaşı, Abdi İpekçi Cad. No:12', district: 'Şişli', city: 'İstanbul' },
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 600000).toISOString() },
      { status: 'accepted', timestamp: new Date(Date.now() - 540000).toISOString() },
      { status: 'preparing', timestamp: new Date(Date.now() - 420000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 600000).toISOString(),
    updatedAt: new Date(Date.now() - 420000).toISOString(),
  },
];

const STATUS_FLOW: Partial<Record<OrderStatus, OrderStatus>> = {
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'on_way',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'border-l-yellow-400 bg-yellow-50',
  accepted: 'border-l-blue-400 bg-blue-50',
  preparing: 'border-l-orange-400 bg-orange-50',
  ready: 'border-l-purple-400 bg-purple-50',
  on_way: 'border-l-indigo-400 bg-indigo-50',
  delivered: 'border-l-green-400 bg-green-50',
};

interface PrepTimer {
  orderId: string;
  timeLeft: number;
}

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [timers, setTimers] = useState<PrepTimer[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active'>('all');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Setup socket
  useEffect(() => {
    const socket = getSocket();
    joinRestaurantRoom('r1');

    socket.on(SOCKET_EVENTS.ORDER_NEW, (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      // Ring notification
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-bounce-in' : ''} bg-white rounded-2xl shadow-2xl border-2 border-primary p-4 flex items-center gap-3 max-w-sm`}>
          <span className="text-3xl">🔔</span>
          <div>
            <p className="font-bold text-gray-800">Yeni Sipariş!</p>
            <p className="text-sm text-gray-500">{order.orderNumber} · {order.total.toFixed(2)} ₺</p>
          </div>
        </div>
      ), { duration: 8000 });
    });

    return () => { socket.off(SOCKET_EVENTS.ORDER_NEW); };
  }, []);

  // Prep timers countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev
          .map((t) => ({ ...t, timeLeft: t.timeLeft - 1 }))
          .filter((t) => t.timeLeft > 0)
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = (orderId: string, prepMinutes: number = 20) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'accepted',
              statusHistory: [...o.statusHistory, { status: 'accepted', timestamp: new Date().toISOString() }],
            }
          : o
      )
    );
    setTimers((prev) => [...prev, { orderId, timeLeft: prepMinutes * 60 }]);
    toast.success('Sipariş kabul edildi!');
    ordersApi.updateStatus(orderId, 'accepted', prepMinutes).catch(() => {});
  };

  const handleReject = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'rejected',
              statusHistory: [...o.statusHistory, { status: 'rejected', timestamp: new Date().toISOString() }],
            }
          : o
      )
    );
    toast.error('Sipariş reddedildi.');
    ordersApi.updateStatus(orderId, 'rejected').catch(() => {});
  };

  const handleNextStatus = (orderId: string, currentStatus: OrderStatus) => {
    const next = STATUS_FLOW[currentStatus];
    if (!next) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: next, statusHistory: [...o.statusHistory, { status: next, timestamp: new Date().toISOString() }] }
          : o
      )
    );
    ordersApi.updateStatus(orderId, next).catch(() => {});
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const filtered = orders.filter((o) => {
    if (filter === 'pending') return o.status === 'pending';
    if (filter === 'active') return ['accepted', 'preparing', 'ready'].includes(o.status);
    return !['delivered', 'cancelled'].includes(o.status);
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-800">Siparişler</h2>
          {pendingCount > 0 && (
            <p className="text-sm text-orange font-semibold mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-orange rounded-full animate-pulse inline-block" />
              {pendingCount} yeni sipariş bekliyor!
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Aktif' },
            { id: 'pending', label: `⏳ Bekleyen (${pendingCount})` },
            { id: 'active', label: '🔥 İşlemde' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`text-sm px-4 py-2 rounded-xl font-medium transition-all border-2 ${
                filter === f.id ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <span className="text-5xl">✅</span>
          <p className="text-lg font-semibold text-gray-600 mt-4">Bekleyen sipariş yok</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((order) => {
            const timer = timers.find((t) => t.orderId === order.id);
            const isPending = order.status === 'pending';
            const cardColor = STATUS_COLORS[order.status] ?? 'bg-white';

            return (
              <div
                key={order.id}
                className={`rounded-2xl border-l-4 p-5 shadow-sm ${cardColor} ${
                  isPending ? 'animate-pulse-ring ring-2 ring-yellow-300' : ''
                } border border-transparent`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-800 text-lg">{order.orderNumber}</span>
                      {isPending && (
                        <span className="flex items-center gap-1 text-xs bg-yellow-400 text-yellow-900 font-bold px-2 py-0.5 rounded-full animate-bounce">
                          🔔 YENİ
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">👤 {order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-primary text-lg">{order.total.toFixed(2)} ₺</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white/70 rounded-xl p-3 mb-3 text-sm space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-gray-700">
                      <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                      <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-sm text-gray-500 mb-4">
                  <span className="text-base">📍</span>
                  <span className="text-xs">{order.address.fullAddress}, {order.address.district}</span>
                </div>

                {/* Timer */}
                {timer && (
                  <div className="bg-white rounded-xl px-3 py-2 text-center mb-3">
                    <p className="text-xs text-gray-400">Hazırlık Süresi</p>
                    <p className="text-2xl font-black text-primary tabular-nums">{formatTimer(timer.timeLeft)}</p>
                  </div>
                )}

                {/* Actions */}
                {isPending ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(order.id)}
                      className="flex-1 py-3 rounded-xl border-2 border-red-300 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      ❌ Reddet
                    </button>
                    <button
                      onClick={() => handleAccept(order.id, 20)}
                      className="flex-2 flex-grow-[2] py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      ✅ Kabul Et (20 dk)
                    </button>
                  </div>
                ) : STATUS_FLOW[order.status] ? (
                  <button
                    onClick={() => handleNextStatus(order.id, order.status)}
                    className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-colors"
                  >
                    {order.status === 'accepted' && '👨‍🍳 Hazırlamaya Başla'}
                    {order.status === 'preparing' && '🎉 Hazır Olarak İşaretle'}
                    {order.status === 'ready' && '🛵 Kuryeye Ver'}
                  </button>
                ) : (
                  <div className="text-center py-2 text-sm text-green-600 font-semibold">
                    🏠 Teslim Edildi
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
