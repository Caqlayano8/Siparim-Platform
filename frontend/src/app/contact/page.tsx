// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const faqs = [
  {
    q: 'Siparişim ne zaman gelir?',
    a: 'Ortalama teslimat süremiz 30 dakikadır. Yoğun saatlerde bu süre biraz uzayabilir.',
  },
  {
    q: 'Siparişimi iptal edebilir miyim?',
    a: 'Restoran siparişi onaylamadan önce iptal edebilirsiniz. Onaylandıktan sonra iptal için bize ulaşın.',
  },
  {
    q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    a: 'Kredi/banka kartı, kapıda nakit ve kapıda kart ile ödeme seçeneklerimiz mevcuttur.',
  },
  {
    q: 'Restoran sahibi olmak istiyorum, ne yapmalıyım?',
    a: 'Kayıt ol sayfasından "Restoran Sahibi" seçeneği ile kayıt olabilir veya bize e-posta gönderebilirsiniz.',
  },
  {
    q: 'Kurye olmak istiyorum?',
    a: 'Kayıt sayfasından kurye başvurusu yapabilirsiniz. Başvurunuz değerlendirildikten sonra size dönüş yapılacaktır.',
  },
  {
    q: 'Siparişimde hata var, ne yapmalıyım?',
    a: 'destek@siparim.com.tr adresine e-posta gönderin ya da bu formu kullanın. En kısa sürede çözüme kavuşturacağız.',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mesajınız alındı! En kısa sürede dönüş yapacağız. 🎉');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 via-orange-500 to-orange-400 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-4">Bize Ulaşın</h1>
          <p className="text-xl text-orange-100">Sorularınız, önerileriniz veya şikayetleriniz için buradayız.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Info Cards */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-800 mb-6">İletişim Bilgileri</h2>

            {[
              { icon: '📧', title: 'Destek', value: 'destek@siparim.com.tr', href: 'mailto:destek@siparim.com.tr' },
              { icon: '📧', title: 'Sipariş', value: 'siparis@siparim.com.tr', href: 'mailto:siparis@siparim.com.tr' },
              { icon: '📍', title: 'Adres', value: 'Artvin, Türkiye', href: null },
              { icon: '🕐', title: 'Çalışma Saatleri', value: '09:00 - 23:00 (Her gün)', href: null },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-0.5">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} className="text-gray-800 font-semibold hover:text-orange-500 transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-800 font-semibold">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white mt-6">
              <p className="font-bold text-lg mb-2">7/24 Destek</p>
              <p className="text-orange-100 text-sm leading-relaxed">
                Platformumuzla ilgili her türlü konuda size yardımcı olmaya hazırız. Mesajınızı aldıktan sonra en geç 24 saat içinde dönüş yapıyoruz.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="text-2xl font-black text-gray-800 mb-6">Mesaj Gönder</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Adınız *</label>
                <input
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors"
                  placeholder="Adınız Soyadınız"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">E-posta *</label>
                <input
                  type="email"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors"
                  placeholder="ornek@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Konu *</label>
                <input
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors"
                  placeholder="Mesajınızın konusu"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Mesajınız *</label>
                <textarea
                  rows={5}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3.5 rounded-2xl hover:from-red-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                Mesaj Gönder 🚀
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-800 mb-3">Sık Sorulan Sorular</h2>
            <p className="text-gray-500">En çok merak edilenler burada.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                <button
                  className="w-full text-left px-6 py-4 font-semibold text-gray-800 hover:bg-orange-50 transition-colors flex items-center justify-between"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className={`text-orange-500 text-xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
