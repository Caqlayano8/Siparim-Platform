'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Address } from '@/types';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<Address, 'id'>) => void;
  initial?: Address;
}

const ADDRESS_TITLES = ['Ev', 'İş', 'Diğer'];

export default function AddressModal({ isOpen, onClose, onSave, initial }: AddressModalProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? 'Ev',
    fullAddress: initial?.fullAddress ?? '',
    district: initial?.district ?? '',
    city: initial?.city ?? 'İstanbul',
    isDefault: initial?.isDefault ?? false,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullAddress.trim() || !form.district.trim()) {
      toast.error('Lütfen tüm alanları doldurun.');
      return;
    }
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl animate-fade-in p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-xl text-gray-800">
            {initial ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Map placeholder */}
        <div className="bg-gray-100 rounded-2xl h-36 mb-5 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50" />
          <div className="relative z-10 text-center">
            <div className="text-4xl mb-1">📍</div>
            <p className="text-sm text-gray-500 font-medium">Harita (Google Maps entegrasyonu)</p>
            <p className="text-xs text-gray-400">Konumunuzu haritada seçin</p>
          </div>
          {/* Grid overlay to look like a map */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border-b border-blue-300" style={{ height: '16.66%' }} />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title pills */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Adres Başlığı
            </label>
            <div className="flex gap-2">
              {ADDRESS_TITLES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, title: t })}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                    form.title === t
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-primary'
                  }`}
                >
                  {t === 'Ev' ? '🏠' : t === 'İş' ? '🏢' : '📌'} {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Açık Adres
            </label>
            <textarea
              className="input-field resize-none h-20"
              placeholder="Mahalle, sokak, bina no, daire no..."
              value={form.fullAddress}
              onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                İlçe
              </label>
              <input
                className="input-field"
                placeholder="Kadıköy"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Şehir
              </label>
              <input
                className="input-field"
                placeholder="İstanbul"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-primary"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            <span className="text-sm text-gray-600">Varsayılan adres olarak ayarla</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">
              İptal
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Kaydediliyor...
                </span>
              ) : (
                'Adresi Kaydet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
