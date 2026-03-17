// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'kategoriler' | 'hizmetler';

const CATEGORIES = [
  {
    key: 'marketing',
    title: '📢 Pazarlama',
    desc: 'Kişiselleştirilmiş teklifler ve kampanyalar sunmak için kullanılır. Siparim ve iş ortakları tarafından ilgi alanlarınıza özel içerikler gösterilmesini sağlar.',
    required: false,
  },
  {
    key: 'functional',
    title: '⚙️ Fonksiyonel',
    desc: 'Konum, dil tercihi ve sipariş geçmişi gibi platform özelliklerinin çalışması için gereklidir. Deneyiminizi kişiselleştirmemize yardımcı olur.',
    required: false,
  },
  {
    key: 'necessary',
    title: '🔒 Zorunlu',
    desc: 'Siparim platformunun temel işlevleri için kesinlikle gereklidir. Giriş durumu, sepet ve güvenlik gibi kritik işlevler bu çerezlere bağlıdır. Devre dışı bırakılamaz.',
    required: true,
  },
];

const SERVICES = [
  { name: 'Google Analytics', purpose: 'Trafik analizi', category: 'Fonksiyonel' },
  { name: 'Cloudflare', purpose: 'Güvenlik ve hız', category: 'Zorunlu' },
  { name: 'İyzico', purpose: 'Ödeme işlemleri', category: 'Zorunlu' },
];

export default function PrivacySettingsModal({ isOpen, onClose }: PrivacySettingsModalProps) {
  const [tab, setTab] = useState<Tab>('kategoriler');
  const [preferences, setPreferences] = useState({ marketing: false, functional: true, necessary: true });
  
  useEffect(() => {
    const saved = localStorage.getItem('siparim_cookie_consent');
    if (saved) {
      try { 
        const p = JSON.parse(saved); 
        setPreferences({ marketing: p.marketing ?? false, functional: p.functional ?? true, necessary: true }); 
      } catch {}
    }
  }, [isOpen]);
  
  const save = () => {
    localStorage.setItem('siparim_cookie_consent', JSON.stringify({ ...preferences, necessary: true, date: new Date().toISOString() }));
    onClose();
  };
  
  const acceptAll = () => {
    const all = { marketing: true, functional: true, necessary: true, date: new Date().toISOString() };
    localStorage.setItem('siparim_cookie_consent', JSON.stringify(all));
    setPreferences({ marketing: true, functional: true, necessary: true });
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-800 text-lg">🔐 Gizlilik Tercihleri</h2>
            <p className="text-xs text-gray-500 mt-0.5">Çerez tercihlerinizi yönetin</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg">×</button>
        </div>
        
        {/* Info */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-sm text-gray-600">
            Platformumuzu daha iyi kullanabilmeniz için çerez ve benzeri teknolojiler kullanıyoruz.
            Tercihlerinizi dilediğiniz zaman değiştirebilirsiniz.{' '}
            <Link href="/kvkk" onClick={onClose} className="text-primary hover:underline text-xs font-semibold">Çerez Politikası</Link>
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-5">
          {(['kategoriler', 'hizmetler'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {tab === 'kategoriler' ? (
            CATEGORIES.map((cat) => (
              <div key={cat.key} className={`p-4 rounded-xl border-2 transition-colors ${preferences[cat.key as keyof typeof preferences] ? 'border-primary/20 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{cat.title}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{cat.desc}</p>
                  </div>
                  <button
                    onClick={() => !cat.required && setPreferences(p => ({ ...p, [cat.key]: !p[cat.key as keyof typeof p] }))}
                    disabled={cat.required}
                    className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors mt-0.5 ${preferences[cat.key as keyof typeof preferences] ? 'bg-primary' : 'bg-gray-300'} ${cat.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${preferences[cat.key as keyof typeof preferences] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                {cat.required && <p className="text-xs text-gray-400 mt-1 italic">Bu çerezlerden vazgeçmek mümkün değildir.</p>}
              </div>
            ))
          ) : (
            <div className="space-y-2">
              {SERVICES.map((s) => (
                <div key={s.name} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.purpose}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${s.category === 'Zorunlu' ? 'bg-gray-200 text-gray-600' : 'bg-primary/10 text-primary'}`}>{s.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex gap-2">
          <button onClick={save} className="flex-1 py-2.5 text-sm font-semibold border-2 border-primary text-primary rounded-xl hover:bg-primary-light transition-colors">
            Seçimi Kaydet
          </button>
          <button onClick={acceptAll} className="flex-1 py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-[#c0110e] transition-colors">
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
