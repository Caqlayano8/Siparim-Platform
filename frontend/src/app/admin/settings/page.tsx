// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({
    courierServiceEnabled: true,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getSettings()
      .then((res) => {
        if (res.data) setSettings(res.data);
      })
      .catch(() => toast.error('Ayarlar yüklenemedi.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings({
        courierServiceEnabled: settings.courierServiceEnabled,
        maintenanceMode: settings.maintenanceMode,
        supportPhone: settings.supportPhone,
        supportWhatsappEnabled: settings.supportWhatsappEnabled,
        supportWhatsappMessage: settings.supportWhatsappMessage,
      });
      localStorage.setItem('courier_service_enabled', String(settings.courierServiceEnabled));
      toast.success('Ayarlar kaydedildi!');
    } catch {
      toast.error('Kayıt başarısız.');
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key: string) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  if (loading) return (
    <div className="space-y-4 max-w-xl">
      <div className="h-8 bg-white rounded-xl animate-pulse w-48" />
      <div className="bg-white rounded-2xl h-64 animate-pulse" />
    </div>
  );

  const TOGGLES = [
    {
      key: 'courierServiceEnabled',
      label: '🛵 Kurye Servisi',
      desc: settings.courierServiceEnabled ? 'Aktif - Siparişler alınıyor' : 'Devre dışı - Siparişler alınamaz',
      activeColor: 'bg-green-500',
      inactiveColor: 'bg-gray-300',
    },
    {
      key: 'maintenanceMode',
      label: '🔧 Bakım Modu',
      desc: settings.maintenanceMode ? 'Aktif - Site bakım modunda' : 'Pasif - Site normal çalışıyor',
      activeColor: 'bg-red-500',
      inactiveColor: 'bg-gray-300',
    },
  ];

  return (
    <div className="space-y-5 max-w-xl">
      <h2 className="text-xl font-black text-gray-800">⚙️ Sistem Ayarları</h2>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        {TOGGLES.map((t) => (
          <div key={t.key} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${settings[t.key] ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div>
              <p className="font-semibold text-gray-800">{t.label}</p>
              <p className={`text-xs mt-0.5 ${settings[t.key] ? 'text-green-600' : 'text-gray-500'}`}>{t.desc}</p>
            </div>
            <button
              onClick={() => toggle(t.key)}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings[t.key] ? t.activeColor : t.inactiveColor}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[t.key] ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3 mt-4 disabled:opacity-60">
          {saving ? 'Kaydediliyor...' : '💾 Ayarları Kaydet'}
        </button>
      </div>

      {/* Canlı Destek Ayarları */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-800">💬 Canlı Destek (WhatsApp)</h3>

        <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${settings.supportWhatsappEnabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <div>
            <p className="font-semibold text-gray-800">WhatsApp Desteği</p>
            <p className={`text-xs mt-0.5 ${settings.supportWhatsappEnabled ? 'text-green-600' : 'text-gray-500'}`}>
              {settings.supportWhatsappEnabled ? 'Aktif - Müşteriler destek butonu görüyor' : 'Pasif - Destek butonu gizli'}
            </p>
          </div>
          <button
            onClick={() => toggle('supportWhatsappEnabled')}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings.supportWhatsappEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.supportWhatsappEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp Numarası</label>
          <input
            type="text"
            placeholder="+90 555 123 45 67"
            value={settings.supportPhone || ''}
            onChange={(e) => setSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-xs text-gray-400 mt-1">Uluslararası format ile girin. Örn: +905551234567</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Karşılama Mesajı</label>
          <textarea
            rows={3}
            placeholder="Merhaba! Siparim hakkında yardım almak istiyorum."
            value={settings.supportWhatsappMessage || ''}
            onChange={(e) => setSettings(prev => ({ ...prev, supportWhatsappMessage: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">Müşteri WhatsApp'ı açtığında otomatik doldurulacak mesaj.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-gray-700 mb-3">Platform Bilgileri</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>Versiyon</span><span className="font-medium">v1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>Backend API</span><span className="font-medium text-green-600">🟢 Çalışıyor</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Ortam</span><span className="font-medium">Production</span>
          </div>
        </div>
      </div>
    </div>
  );
}
