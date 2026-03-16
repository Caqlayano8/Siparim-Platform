'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddressModal from '@/components/AddressModal';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { profileApi } from '@/lib/api';
import { Address } from '@/types';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | undefined>();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileApi.update(form);
      setUser(res.data);
      toast.success('Profil güncellendi!');
    } catch {
      toast.error('Profil güncellenemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (address: Omit<Address, 'id'>) => {
    try {
      const res = await profileApi.addAddress(address);
      const updated = { ...user!, addresses: [...(user?.addresses ?? []), res.data] };
      setUser(updated);
      toast.success('Adres eklendi!');
      setAddressModalOpen(false);
    } catch {
      toast.error('Adres eklenemedi.');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await profileApi.deleteAddress(id);
      const updated = { ...user!, addresses: user?.addresses?.filter((a) => a.id !== id) };
      setUser(updated);
      toast.success('Adres silindi.');
    } catch {
      toast.error('Adres silinemedi.');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await profileApi.setDefaultAddress(id);
      const updated = {
        ...user!,
        addresses: user?.addresses?.map((a) => ({ ...a, isDefault: a.id === id })),
      };
      setUser(updated);
      toast.success('Varsayılan adres güncellendi.');
    } catch {
      toast.error('Güncelleme başarısız.');
    }
  };

  // Mock addresses for demo
  const addresses: Address[] = user?.addresses ?? [
    { id: 'a1', title: 'Ev', fullAddress: 'Örnek Mah. No:5 D:3', district: 'Kadıköy', city: 'İstanbul', isDefault: true },
    { id: 'a2', title: 'İş', fullAddress: 'İş Merkezi, No:10 K:3', district: 'Beşiktaş', city: 'İstanbul', isDefault: false },
  ];

  return (
    <>
      <Navbar />
      <AddressModal
        isOpen={addressModalOpen}
        onClose={() => { setAddressModalOpen(false); setEditAddress(undefined); }}
        onSave={handleSaveAddress}
        initial={editAddress}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-gray-800 mb-6">Profilim</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Avatar + quick info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center text-white text-3xl font-black mx-auto mb-3">
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <h2 className="font-bold text-gray-800 text-lg">{user?.name}</h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <div className="mt-3">
                <span className={`badge text-xs ${
                  user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                  user?.role === 'restaurant_owner' ? 'bg-orange-100 text-orange-700' :
                  'bg-primary-light text-primary'
                }`}>
                  {user?.role === 'admin' ? '⚙️ Admin' :
                   user?.role === 'restaurant_owner' ? '🏪 Restoran Sahibi' :
                   user?.role === 'courier' ? '🛵 Kurye' : '🛍️ Müşteri'}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-3">
                Üyelik: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '—'}
              </p>
            </div>
          </div>

          {/* Right: Forms */}
          <div className="lg:col-span-2 space-y-5">
            {/* Profile form */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Kişisel Bilgiler</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Ad Soyad</label>
                  <input
                    className="input-field"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">E-posta</label>
                  <input
                    type="email"
                    className="input-field"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Telefon</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <button type="submit" disabled={saving} className="btn-primary text-sm py-2.5">
                  {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </form>
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Adreslerim</h2>
                <button
                  onClick={() => { setEditAddress(undefined); setAddressModalOpen(true); }}
                  className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:bg-primary-light px-3 py-1.5 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adres Ekle
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <span className="text-4xl">📍</span>
                  <p className="mt-2 text-sm">Henüz adres eklenmemiş.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all ${
                        addr.isDefault ? 'border-primary bg-primary-light' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">
                        {addr.title === 'Ev' ? '🏠' : addr.title === 'İş' ? '🏢' : '📌'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-gray-800">{addr.title}</p>
                          {addr.isDefault && (
                            <span className="badge bg-primary text-white text-[10px]">Varsayılan</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {addr.fullAddress}, {addr.district}, {addr.city}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            className="text-xs text-gray-400 hover:text-primary px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            Varsayılan Yap
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-gray-300 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Security */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Güvenlik</h2>
              <button className="btn-secondary text-sm py-2.5">🔒 Şifre Değiştir</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
