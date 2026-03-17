// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { items, restaurant, removeItem, updateQuantity, subtotal, total, clearCart } =
    useCartStore();
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const discount = useCartStore((s) => s.discount);
  const sub = subtotal();
  const tot = total();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="w-full max-w-sm bg-white h-full flex flex-col shadow-2xl animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Sepetim</h2>
            {restaurant && (
              <p className="text-xs text-gray-400 mt-0.5">{restaurant.name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center pb-16">
              <span className="text-6xl mb-4">🛒</span>
              <p className="text-gray-500 font-medium">Sepetiniz boş</p>
              <p className="text-sm text-gray-400 mt-1">Restoran sayfasından ürün ekleyin</p>
              <button
                onClick={onClose}
                className="mt-6 btn-primary text-sm py-2 px-5"
              >
                Restoran Bul
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.menuItem.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                {item.menuItem.image && (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.menuItem.image} alt={item.menuItem.name} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{item.menuItem.name}</p>
                  <p className="text-primary font-bold text-sm">
                    {(item.menuItem.price * item.quantity).toFixed(2)} ₺
                  </p>
                  <p className="text-xs text-gray-400">{item.menuItem.price.toFixed(2)} ₺ / adet</p>
                </div>
                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary font-bold hover:bg-primary hover:text-white hover:border-primary transition-colors"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-bold text-sm text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold hover:bg-primary-hover transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{sub.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Teslimat Ücreti</span>
                <span className={deliveryFee === 0 ? 'text-green-500 font-medium' : ''}>
                  {deliveryFee === 0 ? 'Ücretsiz' : `${deliveryFee.toFixed(2)} ₺`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>İndirim</span>
                  <span>−{discount.toFixed(2)} ₺</span>
                </div>
              )}
              {restaurant && sub < restaurant.minOrder && (
                <p className="text-xs text-orange bg-orange-light rounded-lg px-3 py-2">
                  ⚠️ Minimum sipariş tutarı: {restaurant.minOrder} ₺
                  (Eksik: {(restaurant.minOrder - sub).toFixed(2)} ₺)
                </p>
              )}
            </div>

            <div className="flex justify-between font-bold text-base border-t pt-3">
              <span>Toplam</span>
              <span className="text-primary">{tot.toFixed(2)} ₺</span>
            </div>

            <Link
              href="/cart"
              onClick={onClose}
              className={`btn-primary w-full text-center block text-sm ${
                restaurant && sub < restaurant.minOrder ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              Siparişi Tamamla →
            </Link>

            <button
              onClick={() => { clearCart(); toast.success('Sepet temizlendi.'); }}
              className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
            >
              Sepeti Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
