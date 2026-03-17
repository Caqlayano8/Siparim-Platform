// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin panel error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <span className="text-6xl mb-4">⚠️</span>
      <h2 className="text-2xl font-black text-gray-800 mb-2">Bir hata oluştu</h2>
      <p className="text-gray-500 mb-2 max-w-md">
        Bu sayfa yüklenirken bir sorun yaşandı. Backend sunucusunun çalıştığından emin olun.
      </p>
      {error?.message && (
        <p className="text-xs text-red-400 bg-red-50 rounded-xl px-4 py-2 mb-4 max-w-lg font-mono">
          {error.message}
        </p>
      )}
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
      >
        🔄 Tekrar Dene
      </button>
    </div>
  );
}
