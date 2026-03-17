// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ordersApi } from '@/lib/api';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Kredi / Banka Kartı', icon: '💳' },
  { id: 'cash', label: 'Kapıda Nakit', icon: '💵' },
  { id: 'online', label: 'Online Ödeme', icon: '📱' },
];

export default function CartPage() {
  const router = useRouter();
  const { items, restaurant, removeItem, updateQuantity, subtotal, total, clearCart, setPromoCode, promoCode, discount, clearPromo } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoInput, setPromoInput] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  const sub = subtotal();
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const tot = total();
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const res = await ordersApi.applyPromo(promoInput, sub);
      const { discountAmount } = res.data;
      setPromoCode(promoInput.toUpperCase(), discountAmount);
      toast.success(`Promo kodu uygulandı! ${discountAmount.toFixed(2)} ₺ indirim kazandınız.`);
    } catch {
      toast.error('Geçersiz promo kodu.');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!isAuthenticated()) {
      toast.error('Sipariş vermek için giriş yapın.');
      router.push('/login');
      return;
    }
    if (!defaultAddress) {
      toast.error('Lütfen önce bir adres ekleyin.');
      router.push('/profile');
      return;
    }
    if (sub < (restaurant?.minOrder ?? 0)) {
      toast.error(`Minimum sipariş tutarı ${restaurant?.minOrder} ₺`);
      return;
    }
    setLoading(true);
    try {
      const res = await ordersApi.create({
        restaurantId: restaurant?.id,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          name: i.menuItem.name,
          price: i.menuItem.price,
          quantity: i.quantity,
        })),
        address: defaultAddress,
        paymentMethod,
        promoCode: promoCode || undefined,
        note: note || undefined,
      });
      clearCart();
      toast.success('Siparişiniz alındı! 🎉');
      router.push(`/orders/${res.data.id}`);
    } catch {
      toast.error('Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Sepetiniz Boş</h1>
          <p className="text-gray-400 mb-8">Sipariş vermek için restoranlarımıza göz atın.</p>
          <Link href="/restaurants" className="btn-primary inline-block">
            Restoranlara Git
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-gray-800 mb-6">Sepetim</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Items + Details */}
          <div className="flex-1 space-y-4">
            {/* Restaurant info */}
            {restaurant && (
              <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Restoran</p>
                  <p className="font-bold text-gray-800">{restaurant.name}</p>
                </div>
                <Link href={`/restaurants/${restaurant.id}`} className="text-xs text-primary hover:underline">
                  Menüye Dön
                </Link>
              </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-800">Ürünler</h2>
                <button onClick={() => { clearCart(); toast.success('Sepet temizlendi.'); }} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                  Temizle
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.menuItem.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800">{item.menuItem.name}</p>
                      <p className="text-xs text-gray-400">{item.menuItem.price.toFixed(2)} ₺ / adet</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-600 flex items-center justify-center font-bold hover:border-primary hover:text-primary transition-colors">−</button>
                      <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold hover:bg-primary-hover transition-colors">+</button>
                    </div>
                    <p className="font-bold text-primary text-sm w-20 text-right">
                      {(item.menuItem.price * item.quantity).toFixed(2)} ₺
                    </p>
                    <button onClick={() => removeItem(item.menuItem.id)} className="text-gray-300 hover:text-red-500 transition-colors ml-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800">Teslimat Adresi</h2>
                <Link href="/profile" className="text-xs text-primary hover:underline">Değiştir</Link>
              </div>
              {defaultAddress ? (
                <div className="flex items-start gap-3 bg-primary-light rounded-xl p-3">
                  <span className="text-xl mt-0.5">📍</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{defaultAddress.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{defaultAddress.fullAddress}, {defaultAddress.district}, {defaultAddress.city}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-light rounded-xl p-3 text-sm text-orange">
                  ⚠️ Adres eklenmemiş.{' '}
                  <Link href="/profile" className="font-semibold underline">Adres ekle</Link>
                </div>
              )}
            </div>

            {/* Order note */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <label className="font-bold text-gray-800 block mb-2">Sipariş Notu</label>
              <textarea
                className="input-field resize-none h-20 text-sm"
                placeholder="Restoran için not... (opsiyonel)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-3">Ödeme Yöntemi</h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((pm) => (
                  <label key={pm.id} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === pm.id ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="accent-primary" />
                    <span className="text-xl">{pm.icon}</span>
                    <span className="font-medium text-sm text-gray-700">{pm.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
              <h2 className="font-bold text-gray-800 mb-4">Sipariş Özeti</h2>

              {/* Promo */}
              <div className="mb-4">
                {promoCode ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold text-sm">🏷️ {promoCode}</span>
                      <span className="text-xs text-green-500">−{discount.toFixed(2)} ₺</span>
                    </div>
                    <button onClick={clearPromo} className="text-gray-400 hover:text-red-500 text-xs">Kaldır</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      className="input-field flex-1 text-sm py-2.5"
                      placeholder="Promo kodu gir"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                    />
                    <button onClick={handleApplyPromo} disabled={promoLoading || !promoInput} className="btn-secondary text-sm py-2.5 px-4">
                      {promoLoading ? '...' : 'Uygula'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{sub.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Teslimat Ücreti</span>
                  <span className={deliveryFee === 0 ? 'text-green-500' : ''}>
                    {deliveryFee === 0 ? 'Ücretsiz' : `${deliveryFee.toFixed(2)} ₺`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>İndirim</span>
                    <span>−{discount.toFixed(2)} ₺</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t pt-3 mt-2">
                  <span>Toplam</span>
                  <span className="text-primary text-lg">{tot.toFixed(2)} ₺</span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                disabled={loading || sub < (restaurant?.minOrder ?? 0)}
                className="btn-primary w-full mt-5 text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sipariş Veriliyor...
                  </span>
                ) : (
                  `Siparişi Onayla (${tot.toFixed(2)} ₺)`
                )}
              </button>

              {restaurant && sub < restaurant.minOrder && (
                <p className="text-xs text-orange text-center mt-2">
                  ⚠️ Min. sipariş: {restaurant.minOrder} ₺ (Eksik: {(restaurant.minOrder - sub).toFixed(2)} ₺)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
