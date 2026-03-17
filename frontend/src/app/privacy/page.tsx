// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Toplanan Bilgiler',
      content: `Siparim platformunu kullanırken çeşitli bilgiler toplanmaktadır:

Doğrudan Sağladığınız Bilgiler:
• Ad, soyad, e-posta adresi, telefon numarası
• Teslimat adresleri
• Ödeme bilgileri (şifreli olarak saklanır)

Otomatik Toplanan Bilgiler:
• IP adresi ve coğrafi konum
• Tarayıcı türü ve versiyonu
• Platforma giriş tarihleri ve saatleri
• Ziyaret edilen sayfalar ve arama geçmişi
• Cihaz bilgileri (işletim sistemi, ekran çözünürlüğü)`,
    },
    {
      title: '2. Çerez (Cookie) Politikası',
      content: `Siparim, platform deneyiminizi iyileştirmek için çerezler kullanmaktadır.

Zorunlu Çerezler:
Oturum yönetimi, güvenlik ve temel işlevler için kullanılır. Bu çerezler devre dışı bırakılamaz.

Analitik Çerezler:
Platform kullanım istatistiklerini toplamak için kullanılır. Tarayıcı ayarlarınızdan devre dışı bırakabilirsiniz.

Tercih Çerezleri:
Dil, adres ve diğer tercihlerinizi hatırlamak için kullanılır.

Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz. Zorunlu çerezlerin devre dışı bırakılması platforma erişiminizi engelleyebilir.`,
    },
    {
      title: '3. Veri Güvenliği',
      content: `Kişisel verilerinizin güvenliği için aşağıdaki önlemler alınmaktadır:

• SSL/TLS şifreleme ile veri transferi
• Ödeme bilgileri için PCI DSS uyumlu güvenli altyapı
• Düzenli güvenlik denetimleri ve penetrasyon testleri
• Çalışan erişimlerinin minimum yetki prensibiyle sınırlandırılması
• Veri ihlali durumunda 72 saat içinde KVKK'ya bildirim
• Düzenli yedekleme ve felaket kurtarma planları

Bununla birlikte, hiçbir internet aktarımı veya elektronik depolama sistemi %100 güvenli değildir. Olası ihlallerde sizi derhal bilgilendireceğiz.`,
    },
    {
      title: '4. Üçüncü Taraf Hizmetler',
      content: `Platformumuz bazı üçüncü taraf hizmetlerden yararlanmaktadır:

Ödeme İşleme:
Ödeme işlemleriniz güvenli üçüncü taraf ödeme altyapısı üzerinden gerçekleştirilir. Kart bilgileriniz Siparim sunucularında saklanmaz.

Harita ve Konum Hizmetleri:
Adres doğrulama ve teslimat takibi için harita API'leri kullanılmaktadır.

Analitik:
Platform performansını ölçmek için anonim analitik araçlar kullanılmaktadır.

Bu üçüncü tarafların kendi gizlilik politikaları mevcuttur ve bu politikalar üzerinde kontrolümüz bulunmamaktadır.`,
    },
    {
      title: '5. Veri Saklama ve Silme',
      content: `Kişisel verileriniz şu sürelerde saklanır:

• Hesap bilgileri: Hesabı kapatana kadar + 3 yıl
• Sipariş geçmişi: 10 yıl (yasal zorunluluk)
• Finansal kayıtlar: 10 yıl (vergi mevzuatı)
• Çerez verileri: Maksimum 12 ay

Hesabınızı silmek veya verilerinizin kaldırılmasını talep etmek için destek@siparim.com.tr adresine e-posta gönderebilirsiniz. Yasal saklama zorunluluğu olan veriler dışındaki tüm verileriniz 30 gün içinde silinir.`,
    },
    {
      title: '6. Çocukların Gizliliği',
      content: `Siparim platformu 18 yaş altındaki bireylere yönelik değildir. 18 yaş altındaki bireylerden bilerek kişisel veri toplamıyoruz.

Ebeveyn veya vasilerin, çocuklarının yaşını bildirmeden platforma üye olduğunu fark etmesi durumunda destek@siparim.com.tr adresine bildirmeleri ve ilgili hesabın silinmesi talebinde bulunmaları gerekmektedir.`,
    },
    {
      title: '7. İletişim',
      content: `Gizlilik politikamızla ilgili sorularınız için:

E-posta: destek@siparim.com.tr
Adres: Artvin, Türkiye

Veri koruma konusundaki şikayetlerinizi Kişisel Verileri Koruma Kurumu'na (www.kvkk.gov.tr) iletebilirsiniz.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-700 to-purple-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-indigo-200 text-sm font-medium mb-2">Son güncellenme: Ocak 2024</p>
          <h1 className="text-3xl md:text-4xl font-black">Gizlilik Politikası</h1>
          <p className="text-indigo-200 mt-3 text-sm max-w-2xl leading-relaxed">
            Siparim olarak gizliliğinize önem veriyoruz. Bu politika, kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklamaktadır.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-indigo-700 mb-3 border-b border-gray-100 pb-2">{section.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-gradient-to-r from-indigo-700 to-purple-600 rounded-2xl text-center text-sm text-white">
          <p className="font-semibold text-lg mb-1">© 2024 Siparim - Çağlayan KURTOĞLU</p>
          <p className="text-indigo-200">Tüm hakları saklıdır. İzinsiz kopyalanamaz ve dağıtılamaz.</p>
          <a href="mailto:destek@siparim.com.tr" className="text-yellow-300 hover:underline mt-2 block font-medium">
            destek@siparim.com.tr
          </a>
        </div>
      </div>
    </div>
  );
}
