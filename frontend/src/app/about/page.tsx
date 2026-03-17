// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { value: '50+', label: 'Restoran' },
    { value: '1000+', label: 'Mutlu Müşteri' },
    { value: '30 dk', label: 'Ortalama Teslimat' },
    { value: '7/24', label: 'Destek' },
  ];

  const values = [
    { icon: '⚡', title: 'Hız', desc: 'En hızlı teslimat için her adımda optimize ediyoruz.' },
    { icon: '🛡️', title: 'Güven', desc: 'Güvenli ödeme ve şeffaf işlem süreçleri.' },
    { icon: '⭐', title: 'Kalite', desc: 'Sadece kaliteli ve hijyenik restoranlara yer veriyoruz.' },
    { icon: '❤️', title: 'Müşteri Memnuniyeti', desc: 'Mutlu müşteri bizim en büyük önceliğimiz.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 via-orange-500 to-orange-400 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Yemeğin En Hızlı Yolu
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto leading-relaxed">
            Artvin'in lezzetlerini kapınıza getiriyoruz. Hızlı, güvenilir, lezzetli.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/restaurants" className="bg-white text-orange-500 font-bold px-8 py-3 rounded-2xl hover:bg-orange-50 transition-colors">
              Restoranları Keşfet
            </Link>
            <Link href="/contact" className="border-2 border-white text-white font-bold px-8 py-3 rounded-2xl hover:bg-white/10 transition-colors">
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📖</span>
              <h2 className="text-3xl font-black text-gray-800">Hikayemiz</h2>
            </div>
            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-4">
              <p>
                <strong className="text-orange-500">Siparim</strong>, Artvin&apos;in ilk yemek sipariş platformudur. 2024 yılında kurulan Siparim, Artvin&apos;deki restoranları ve lezzetleri doğrudan kapınıza getiriyor.
              </p>
              <p>
                Artvin&apos;de yaşayanların en sevdiği yemekleri kolayca sipariş edebileceği, yerel restoran sahiplerinin işlerini dijitale taşıyabileceği ve kuryelerin kazanç elde edebileceği bir ekosistem oluşturduk.
              </p>
              <p>
                Amacımız sadece yemek taşımak değil; Artvin&apos;deki yerel ekonomiyi güçlendirmek, esnafımıza destek olmak ve şehrimizi daha yaşanabilir kılmaktır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <p className="text-4xl md:text-5xl font-black mb-2">{stat.value}</p>
                <p className="text-orange-100 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-sm p-8 border-t-4 border-orange-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎯</span>
              <h3 className="text-2xl font-black text-gray-800">Misyonumuz</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Artvin&apos;deki restoranlar ile müşterileri hızlı, güvenilir ve şeffaf bir platform üzerinden buluşturmak. Her siparişte kaliteli hizmet sunarak yerel ekonomiye katkı sağlamak.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-8 border-t-4 border-red-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🚀</span>
              <h3 className="text-2xl font-black text-gray-800">Vizyonumuz</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Türkiye&apos;nin en güvenilir bölgesel yemek teslimat platformu olmak. Artvin&apos;den başlayarak tüm Türkiye&apos;nin dört bir yanına ulaşmak ve milyonlarca insanın hayatını kolaylaştırmak.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-800 mb-3">Değerlerimiz</h2>
            <p className="text-gray-500">Her kararımızda bu değerler bize rehberlik eder.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-orange-50 transition-colors group">
                <span className="text-4xl mb-4 block">{v.icon}</span>
                <h4 className="font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">{v.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-black mb-4">Bize Ulaşın</h2>
            <p className="text-orange-100 mb-8 text-lg">Sorularınız veya önerileriniz için her zaman buradayız.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:destek@siparim.com.tr" className="bg-white/20 hover:bg-white/30 transition-colors px-6 py-3 rounded-2xl font-semibold">
                📧 destek@siparim.com.tr
              </a>
              <a href="mailto:siparis@siparim.com.tr" className="bg-white/20 hover:bg-white/30 transition-colors px-6 py-3 rounded-2xl font-semibold">
                📧 siparis@siparim.com.tr
              </a>
            </div>
            <div className="mt-6">
              <Link href="/contact" className="underline text-orange-100 hover:text-white text-sm transition-colors">
                İletişim sayfamızı ziyaret edin →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
