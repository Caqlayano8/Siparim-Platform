// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';

export default function CourierBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const enabled = localStorage.getItem('courier_service_enabled');
    if (enabled === 'false') setShow(true);
  }, []);

  if (!show || dismissed) return null;

  return (
    <div className="bg-yellow-400 text-yellow-900 px-4 py-2.5 text-sm font-semibold flex items-center justify-between gap-3 z-50">
      <span>⚠️ Kurye servisi şu anda devre dışı — Siparişler alınamaz</span>
      <button
        onClick={() => setDismissed(true)}
        className="text-yellow-800 hover:text-yellow-900 font-bold text-lg leading-none"
        aria-label="Kapat"
      >
        ×
      </button>
    </div>
  );
}
