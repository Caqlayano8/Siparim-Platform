// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookieConsentProps {
  onOpenPrivacySettings: () => void;
}

export default function CookieConsent({ onOpenPrivacySettings }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem('siparim_cookie_consent');
    if (!consent) setVisible(true);
  }, []);
  
  const acceptAll = () => {
    localStorage.setItem('siparim_cookie_consent', JSON.stringify({ 
      marketing: true, functional: true, necessary: true, date: new Date().toISOString() 
    }));
    setVisible(false);
  };
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t-2 border-primary shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl flex-shrink-0">🍪</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Çerez Politikası</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Size daha iyi hizmet sunmak için çerezler kullanıyoruz.{' '}
              <Link href="/kvkk" className="text-primary hover:underline">KVKK</Link> ve{' '}
              <Link href="/privacy" className="text-primary hover:underline">Gizlilik Politikası</Link>&apos;nı inceleyebilirsiniz.
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={onOpenPrivacySettings}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold border-2 border-primary text-primary rounded-xl hover:bg-primary-light transition-colors"
          >
            Gizlilik Ayarları
          </button>
          <button
            onClick={acceptAll}
            className="flex-1 sm:flex-none px-5 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-[#c0110e] transition-colors"
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
