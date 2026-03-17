// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomeBanner() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = localStorage.getItem('siparim_welcome_shown');
    if (!shown) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('siparim_welcome_shown', 'true');
    setVisible(false);
  };

  const handleKesfet = () => {
    dismiss();
    router.push('/register?promo=HOSGELDIN');
  };

  if (!visible) return null;

  return (
    <div className="animate-slide-up fixed bottom-20 left-0 right-0 z-50 px-4 pb-2 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto bg-gradient-to-r from-primary to-orange-500 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎉</span>
          <div>
            <p className="font-bold text-sm">Hoş geldiniz!</p>
            <p className="text-xs text-white/90">İlk siparişinizde özel indirim sizi bekliyor.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleKesfet}
            className="px-4 py-2 text-xs font-bold bg-white text-primary rounded-xl hover:bg-gray-100 transition-colors"
          >
            Hemen Keşfet
          </button>
          <button
            onClick={dismiss}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white text-lg font-bold transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
