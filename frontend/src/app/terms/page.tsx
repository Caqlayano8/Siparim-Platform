// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Genel Hükümler',
      content: `Siparim platformunu kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Bu koşullar, Siparim ile kullanıcı arasındaki hukuki ilişkiyi düzenlemekte olup Türk hukuku kapsamında geçerlidir.

Siparim, önceden haber vermeksizin bu koşulları güncelleme hakkını saklı tutar. Güncel koşullar platform üzerinde yayımlanır ve yayım tarihinden itibaren geçerli olur. Platformu kullanmaya devam etmeniz, güncellenmiş koşulları kabul ettiğiniz anlamına gelir.`,
    },
    {
      title: '2. Hesap Oluşturma ve Kullanım',
      content: `Platforma üye olmak için 18 yaşını doldurmuş olmanız gerekmektedir. Hesap oluştururken verdiğiniz bilgilerin doğru ve güncel olmasından siz sorumlusunuz.

• Hesap bilgilerinizi (kullanıcı adı, şifre) gizli tutmak zorundasınız
• Hesabınızın yetkisiz kullanımını derhal bize bildirmelisiniz
• Bir kişi yalnızca bir hesap oluşturabilir
• Yanlış veya yanıltıcı bilgi verilmesi hesabın kapatılmasına yol açabilir`,
    },
    {
      title: '3. Sipariş Verme',
      content: `Platform üzerinden verilen siparişler yasal bir teklif niteliği taşır. Siparişiniz restoran tarafından onaylandıktan sonra bağlayıcı bir sözleşme kurulmuş olur.

• Sipariş onayından önce ürün ve fiyat bilgilerini kontrol etmeniz önerilir
• Minimum sipariş tutarı restorandan restorana değişiklik gösterebilir
• Siparim, restoranların menü içeriklerini ve fiyatlarını garanti etmez
• Teslimat süresi tahmini olup trafik veya hava koşullarına göre değişebilir`,
    },
    {
      title: '4. Ödeme Koşulları',
      content: `Siparim, güvenli ödeme altyapısı sağlar. Ödeme yöntemleri şunlardır:

• Kredi kartı / banka kartı (3D Secure korumalı)
• Kapıda nakit ödeme
• Kapıda kart ile ödeme

Ödeme bilgileri şifrelenerek saklanır ve hiçbir koşulda üçüncü taraflarla paylaşılmaz. Siparim, hatalı ücretlendirmeler için iade hakkı sunar.`,
    },
    {
      title: '5. İptal ve İade Politikası',
      content: `Sipariş iptali:
• Restoran onaylamadan önce: Ücretsiz iptal mümkündür
• Restoran onayladıktan sonra: İptal için destek hattı ile iletişime geçin

İade koşulları:
• Yanlış ürün teslim edilmişse tam iade yapılır
• Ürün kalite problemi yaşandıysa belge ile başvuru yapın
• İade süreci 3-7 iş günü içinde tamamlanır
• Nakit ödemelerde iade dijital yöntemle gerçekleştirilemez`,
    },
    {
      title: '6. Sorumluluk Sınırı',
      content: `Siparim, aşağıdaki durumlardan kaynaklanan zararlardan sorumlu değildir:

• Restoran tarafından sağlanan ürünlerin kalitesi veya içeriği
• Kurye hizmetlerinden kaynaklanan gecikmeler (mücbir sebepler)
• Kullanıcının hatalı adres veya bilgi girişi
• İnternet bağlantısı veya cihaz kaynaklı erişim sorunları
• Force majeure (doğal afet, salgın, savaş vb.) durumları

Siparim'in herhangi bir olaydaki maksimum sorumluluğu, ilgili sipariş bedeliyle sınırlıdır.`,
    },
    {
      title: '7. Fikri Mülkiyet',
      content: `Siparim markası, logosu, yazılımı ve tüm içerikleri Çağlayan KURTOĞLU'na aittir ve tüm fikri mülkiyet hakları saklıdır.

Kullanıcılar; platformun kaynak kodunu kopyalayamaz, çoğaltamaz, tersine mühendislik uygulayamaz veya ticari amaçlarla kullanamaz. Bu koşulların ihlali yasal kovuşturmayla sonuçlanabilir.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 text-sm font-medium mb-2">Son güncellenme: Ocak 2024</p>
          <h1 className="text-3xl md:text-4xl font-black">Kullanım Koşulları</h1>
          <p className="text-gray-300 mt-3 text-sm">
            Siparim platformunu kullanmadan önce lütfen bu koşulları dikkatlice okuyun.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">{section.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-gray-800 rounded-2xl text-center text-sm text-gray-400">
          <p className="font-semibold text-gray-200 mb-1">© 2024 Siparim - Çağlayan KURTOĞLU</p>
          <p>Tüm hakları saklıdır. Bu koşullar Türkiye Cumhuriyeti hukuku kapsamında geçerlidir.</p>
          <a href="mailto:destek@siparim.com.tr" className="text-orange-400 hover:underline mt-2 block">
            destek@siparim.com.tr
          </a>
        </div>
      </div>
    </div>
  );
}
