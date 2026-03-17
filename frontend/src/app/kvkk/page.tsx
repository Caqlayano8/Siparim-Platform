// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

export default function KvkkPage() {
  const sections = [
    {
      title: '1. Toplanan Kişisel Veriler',
      content: `Siparim platformu aracılığıyla aşağıdaki kişisel veriler toplanmaktadır:

• Kimlik Bilgileri: Ad, soyad, doğum tarihi
• İletişim Bilgileri: E-posta adresi, telefon numarası, teslimat adresi
• Finansal Bilgiler: Ödeme yöntemi bilgileri (kart numarası şifrelenerek saklanır)
• Sipariş Bilgileri: Sipariş geçmişi, tercih edilen restoranlar
• Teknik Veriler: IP adresi, cihaz bilgisi, çerez verileri`,
    },
    {
      title: '2. Kişisel Veri İşleme Amacı',
      content: `Toplanan kişisel veriler aşağıdaki amaçlarla işlenmektedir:

• Sipariş süreçlerinin yürütülmesi ve teslimatın gerçekleştirilmesi
• Kullanıcı hesabının oluşturulması ve yönetilmesi
• Müşteri hizmetleri ve destek faaliyetleri
• Platform güvenliğinin sağlanması ve dolandırıcılığın önlenmesi
• Yasal yükümlülüklerin yerine getirilmesi
• Hizmet kalitesinin artırılması ve kişiselleştirilmesi`,
    },
    {
      title: '3. Kişisel Veri Paylaşımı',
      content: `Kişisel verileriniz aşağıdaki üçüncü taraflarla paylaşılabilir:

• Sipariş ettiğiniz restoranlar (teslimat için gerekli bilgiler)
• Teslimatı gerçekleştiren kurye hizmet sağlayıcıları
• Ödeme işlemcileri ve bankalar (güvenli ödeme altyapısı)
• Yasal zorunluluk halinde kamu kurum ve kuruluşları

Kişisel verileriniz ticari amaçlarla üçüncü taraflara satılmamakta veya kiralanmamaktadır.`,
    },
    {
      title: '4. Kişisel Veri Saklama Süresi',
      content: `Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca saklanmaktadır:

• Hesap bilgileri: Hesap kapatılana kadar + 3 yıl
• Sipariş kayıtları: 10 yıl (Türk Ticaret Kanunu gereği)
• Finansal işlem kayıtları: 10 yıl (Vergi mevzuatı gereği)
• Çerez verileri: Çerez türüne göre değişmekle birlikte maksimum 1 yıl`,
    },
    {
      title: '5. KVKK Kapsamındaki Haklarınız',
      content: `6698 sayılı KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:

• Kişisel verilerinizin işlenip işlenmediğini öğrenme hakkı
• İşlenmişse buna ilişkin bilgi talep etme hakkı
• İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme hakkı
• Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme hakkı
• Eksik veya yanlış işlenmiş ise düzeltilmesini isteme hakkı
• KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini isteme hakkı
• İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi sonucu kişi aleyhine bir sonucun ortaya çıkmasına itiraz etme hakkı
• Kanuna aykırı işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme hakkı`,
    },
    {
      title: '6. İletişim ve Başvuru',
      content: `KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki iletişim kanallarını kullanabilirsiniz:

• E-posta: destek@siparim.com.tr
• Adres: Artvin, Türkiye

Başvurunuz, niteliğine göre en kısa sürede ve en geç 30 (otuz) gün içinde ücretsiz olarak sonuçlandırılacaktır. İşlemin ayrıca bir maliyet gerektirmesi halinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret alınacaktır.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-200 text-sm font-medium mb-2">Son güncellenme: Ocak 2024</p>
          <h1 className="text-3xl md:text-4xl font-black leading-tight">
            Kişisel Verilerin Korunması Kanunu (KVKK)<br />Aydınlatma Metni
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Veri Sorumlusu */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-800 mb-2">Veri Sorumlusu</h2>
          <p className="text-blue-700 text-sm leading-relaxed">
            <strong>Ünvan:</strong> Siparim - Çağlayan KURTOĞLU<br />
            <strong>E-posta:</strong> destek@siparim.com.tr<br />
            <strong>Adres:</strong> Artvin, Türkiye
          </p>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed text-sm">
          Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında, Siparim platformu tarafından kişisel verilerinizin nasıl toplandığı, işlendiği ve korunduğu konusunda sizi bilgilendirmek amacıyla hazırlanmıştır.
        </p>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-blue-700 mb-3">{section.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-gray-100 rounded-2xl text-center text-sm text-gray-500">
          <p>© 2024 Siparim - Çağlayan KURTOĞLU. Bu metin ticari sır niteliğinde olup izinsiz kopyalanamaz.</p>
          <a href="mailto:destek@siparim.com.tr" className="text-blue-500 hover:underline mt-2 block">
            destek@siparim.com.tr
          </a>
        </div>
      </div>
    </div>
  );
}
