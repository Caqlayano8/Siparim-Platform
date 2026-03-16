import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo.svg" alt="Siparim" width={100} height={28} className="brightness-0 invert" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Türkiye&apos;nin en hızlı yemek teslimat platformu. Binlerce restoran, kapında.
            </p>
            <div className="flex gap-3 mt-4">
              {['🐦', '📘', '📸'].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-primary transition-colors text-base">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Keşfet</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Restoranlar', '/restaurants'],
                ['Kampanyalar', '/campaigns'],
                ['Yeni Açılanlar', '/restaurants?filter=new'],
                ['En Çok Sipariş', '/restaurants?filter=popular'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Hesabım</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Giriş Yap', '/login'],
                ['Kayıt Ol', '/register'],
                ['Siparişlerim', '/orders'],
                ['Profilim', '/profile'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Kurumsal</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Hakkımızda', '/about'],
                ['Restoran Ol', '/register?role=restaurant'],
                ['Kurye Ol', '/register?role=courier'],
                ['İletişim', '/contact'],
                ['KVKK', '/privacy'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} Siparim. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Gizlilik</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Çerezler</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
