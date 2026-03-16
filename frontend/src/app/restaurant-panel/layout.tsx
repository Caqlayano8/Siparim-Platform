'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
  { href: '/restaurant-panel', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/restaurant-panel/orders', label: 'Siparişler', icon: '🛒' },
  { href: '/restaurant-panel/menu', label: 'Menü Yönetimi', icon: '🍽️' },
  { href: '/restaurant-panel/earnings', label: 'Kazançlar', icon: '💰' },
];

export default function RestaurantPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black">
              Sipari<span className="text-orange">m</span>
            </span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Restoran Paneli</p>
        </div>

        {/* Restaurant info */}
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-3 py-2.5">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              🏪
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-white truncate">Restoran Adım</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <span>🌐</span> Siteye Git
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
          >
            <span>🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-bold text-gray-800 hidden lg:block">
            {NAV_ITEMS.find((n) => n.exact ? pathname === n.href : pathname.startsWith(n.href))?.label ?? 'Panel'}
          </h1>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
