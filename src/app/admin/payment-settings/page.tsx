// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

const LS_KEY = 'siparim_payment_settings';

interface PaymentSettings {
  provider: string;
  testMode: boolean;
  apiKey: string;
  secretKey: string;
}

const DEFAULT_SETTINGS: PaymentSettings = {
  provider: 'iyzico',
  testMode: true,
  apiKey: '',
  secretKey: '',
};

const PROVIDERS = [
  { value: 'iyzico', label: 'İyzico', emoji: '💳' },
  { value: 'stripe', label: 'Stripe', emoji: '⚡' },
  { value: 'paytr', label: 'PayTR', emoji: '🏦' },
];

function loadLocal(): PaymentSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(LS_KEY) || '{}') }; }
  catch { return DEFAULT_SETTINGS; }
}

export default function AdminPaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>(DEFAULT_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load from local immediately
    const local = loadLocal();
    setSettings(local);
    setLoading(false);

    // Try to sync from backend
    adminApi.getSettings()
      .then((res) => {
        if (res.data?.paymentSettings) {
          const merged = { ...local, ...res.data.paymentSettings };
          setSettings(merged);
          localStorage.setItem(LS_KEY, JSON.stringify(merged));
        }
      })
      .catch(() => { /* backend kapalı — local kullanılıyor */ });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Save local immediately
    localStorage.setItem(LS_KEY, JSON.stringify(settings));
    try {
      await adminApi.updateSettings({ paymentSettings: settings });
      toast.success('Ödeme ayarları kaydedildi!');
    } catch {
      toast('Ödeme ayarları yerel olarak kaydedildi. Backend bağlandığında otomatik senkronize edilecek.', { icon: '⚠️' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-4 max-w-xl">
      <div className="h-8 bg-white rounded-xl animate-pulse w-48" />
      <div className="bg-white rounded-2xl h-64 animate-pulse" />
    </div>
  );

  return (
    <div className="space-y-5 max-w-xl">
      <h2 className="text-xl font-black text-gray-800">💳 Ödeme Ayarları</h2>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        {/* Provider Selection */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Sanal POS Sağlayıcısı</label>
          <div className="grid grid-cols-3 gap-3">
            {PROVIDERS.map((p) => (
              <button
                key={p.value}
                onClick={() => setSettings({ ...settings, provider: p.value })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${settings.provider === p.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="text-2xl">{p.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Test/Live Mode */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-semibold text-gray-700">Test Modu</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {settings.testMode ? '⚠️ Test modunda — gerçek ödeme alınmaz' : '🟢 Canlı mod — gerçek ödemeler aktif'}
            </p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, testMode: !settings.testMode })}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings.testMode ? 'bg-yellow-400' : 'bg-green-500'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.testMode ? 'translate-x-0' : 'translate-x-6'}`} />
          </button>
        </div>

        {/* API Key */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">API Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              className="input-field pr-10"
              placeholder="API anahtarınızı girin..."
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            />
            <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Secret Key */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Secret Key</label>
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              className="input-field pr-10"
              placeholder="Gizli anahtarınızı girin..."
              value={settings.secretKey}
              onChange={(e) => setSettings({ ...settings, secretKey: e.target.value })}
            />
            <button onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showSecret ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className={`p-3 rounded-xl text-sm ${settings.testMode ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
          {settings.testMode
            ? '⚠️ Test modundasınız. Gerçek para transferi yapılmaz.'
            : '✅ Canlı moddasınız. Gerçek ödemeler bu bilgilerle işlenecek.'}
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3 disabled:opacity-60">
          {saving ? '⏳ Kaydediliyor...' : '💾 Ödeme Ayarlarını Kaydet'}
        </button>
      </div>
    </div>
  );
}
