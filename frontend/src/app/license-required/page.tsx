// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

export default function LicenseRequiredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-orange-400 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
        {/* Lock Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Logo */}
        <img src="/logo.svg" alt="Siparim" className="h-8 mx-auto mb-4" />

        <h1 className="text-2xl font-black text-gray-800 mb-3">
          Lisans Gerekli
        </h1>

        <p className="text-gray-500 leading-relaxed mb-2">
          Bu sistem lisanssız çalışamaz.
        </p>
        <p className="text-gray-500 leading-relaxed mb-8">
          Siparim platformunu kullanabilmek için geçerli bir lisans anahtarı gerekmektedir. Lütfen lisans almak için bizimle iletişime geçin.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-orange-700 font-semibold mb-1">Lisans için iletişim:</p>
          <a href="mailto:destek@siparim.com.tr" className="text-orange-600 hover:text-orange-700 font-bold text-lg">
            destek@siparim.com.tr
          </a>
        </div>

        <div className="text-xs text-gray-400 border-t pt-4">
          <p>© 2024 Siparim - Çağlayan KURTOĞLU</p>
          <p className="mt-1">Yetkisiz kullanım yasaktır.</p>
        </div>
      </div>
    </div>
  );
}
