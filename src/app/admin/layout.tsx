// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/restaurants', label: 'Restoranlar', icon: '🏪' },
  { href: '/admin/orders', label: 'Siparişler', icon: '📦' },
  { href: '/admin/couriers', label: 'Kuryeler', icon: '🛵' },
  { href: '/admin/users', label: 'Kullanıcılar', icon: '👥' },
  { href: '/admin/payment-settings', label: 'Ödeme Ayarları', icon: '💳' },
  { href: '/admin/settings', label: 'Sistem Ayarları', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const displayName = mounted ? (user?.name ?? 'Admin') : 'Admin';
  const displayInitial = mounted ? (user?.name?.charAt(0) ?? 'A') : 'A';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-950 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col`}>
        <div className="px-6 py-5 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black">Sipari<span className="text-orange">m</span></span>
          </Link>
          <span className="text-xs text-gray-400 mt-1 block">Admin Paneli</span>
        </div>

        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-3 py-2.5">
            <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {displayInitial}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-400">Süper Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <span>🌐</span> Siteye Git
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors">
            <span>🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="badge bg-purple-100 text-purple-700 text-xs">⚙️ Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
