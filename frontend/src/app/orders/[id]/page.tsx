// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';
import { ordersApi } from '@/lib/api';
import { getSocket, SOCKET_EVENTS } from '@/lib/socket';
import { useOrderStore } from '@/store/orderStore';
import { Order } from '@/types';

// Mock order for demo
const MOCK_ORDER: Order = {
  id: 'ord-2',
  orderNumber: '#1002',
  customerId: 'u1',
  restaurantId: '2',
  restaurantName: 'Pizza Hut',
  courierName: 'Mehmet K.',
  items: [
    { menuItemId: 'm20', name: 'Margarita Pizza', price: 149.90, quantity: 1 },
    { menuItemId: 'm21', name: 'Cola', price: 24.90, quantity: 2 },
  ],
  subtotal: 199.70,
  deliveryFee: 14.99,
  discount: 20,
  total: 194.69,
  status: 'on_way',
  address: { id: 'a1', title: 'Ev', fullAddress: 'Örnek Mahallesi, No:5, D:3', district: 'Kadıköy', city: 'İstanbul' },
  statusHistory: [
    { status: 'pending', timestamp: new Date(Date.now() - 1800000).toISOString() },
    { status: 'accepted', timestamp: new Date(Date.now() - 1600000).toISOString() },
    { status: 'preparing', timestamp: new Date(Date.now() - 1200000).toISOString() },
    { status: 'on_way', timestamp: new Date(Date.now() - 600000).toISOString() },
  ],
  estimatedDelivery: new Date(Date.now() + 600000).toISOString(),
  createdAt: new Date(Date.now() - 1800000).toISOString(),
  updatedAt: new Date(Date.now() - 600000).toISOString(),
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order>(MOCK_ORDER);
  const [loading, setLoading] = useState(false);
  const { updateOrderStatus } = useOrderStore();

  useEffect(() => {
    // In production, fetch order and connect socket:
    // ordersApi.getById(id).then(res => setOrder(res.data));

    const socket = getSocket();
    socket.emit('order:track', { orderId: id });

    socket.on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, (data: { orderId: string; status: Order['status'] }) => {
      if (data.orderId === id) {
        setOrder((prev) => ({
          ...prev,
          status: data.status,
          statusHistory: [
            ...prev.statusHistory,
            { status: data.status, timestamp: new Date().toISOString() },
          ],
        }));
        updateOrderStatus(data.orderId, data.status);
      }
    });

    return () => {
      socket.off(SOCKET_EVENTS.ORDER_STATUS_UPDATED);
    };
  }, [id, updateOrderStatus]);

  const estimatedMinutes = order.estimatedDelivery
    ? Math.max(0, Math.round((new Date(order.estimatedDelivery).getTime() - Date.now()) / 60000))
    : null;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/orders" className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-800">Sipariş Takibi</h1>
            <p className="text-sm text-gray-400">{order.orderNumber} · {order.restaurantName}</p>
          </div>
        </div>

        {/* ETA banner */}
        {order.status === 'on_way' && estimatedMinutes !== null && (
          <div className="bg-gradient-to-r from-primary to-orange text-white rounded-2xl p-5 mb-5 text-center">
            <p className="text-sm text-white/80 mb-1">Tahmini Teslimat</p>
            <p className="text-4xl font-black">{estimatedMinutes} <span className="text-2xl font-bold">dk</span></p>
            <p className="text-sm text-white/80 mt-1">🛵 Kurye yolda: {order.courierName}</p>
          </div>
        )}

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
          <h2 className="font-bold text-gray-800 mb-5">Sipariş Durumu</h2>
          <OrderStatusTimeline currentStatus={order.status} statusHistory={order.statusHistory} />
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
          <h2 className="font-bold text-gray-800 mb-4">Sipariş Detayı</h2>
          <div className="space-y-2 text-sm">
            {order.items.map((item) => (
              <div key={item.menuItemId} className="flex justify-between text-gray-700">
                <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                <span className="font-medium">{(item.price * item.quantity).toFixed(2)} ₺</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Ara Toplam</span>
              <span>{order.subtotal.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Teslimat Ücreti</span>
              <span>{order.deliveryFee.toFixed(2)} ₺</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>İndirim</span>
                <span>−{order.discount.toFixed(2)} ₺</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-2 border-t">
              <span>Toplam</span>
              <span className="text-primary">{order.total.toFixed(2)} ₺</span>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-3">Teslimat Adresi</h2>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <p className="font-semibold text-sm text-gray-800">{order.address.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {order.address.fullAddress}, {order.address.district}, {order.address.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
