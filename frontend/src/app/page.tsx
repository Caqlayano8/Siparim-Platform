// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantCard from '@/components/RestaurantCard';
import CategoryFilter from '@/components/CategoryFilter';
import CartSidebar from '@/components/CartSidebar';
import LocationPicker from '@/components/LocationPicker';
import { Restaurant } from '@/types';

const FEATURED_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Burger King',
    description: 'Alev ızgara lezzeti',
    logo: 'https://placehold.co/80x80/e8231a/white?text=BK',
    coverImage: 'https://placehold.co/400x200/e8231a/white?text=Burger+King',
    category: 'Burger',
    categoryEmoji: '🍔',
    rating: 4.5,
    reviewCount: 2341,
    deliveryTime: 25,
    deliveryFee: 9.99,
    minOrder: 50,
    isOpen: true,
    isApproved: true,
    address: 'Bağcılar Mah.',
    district: 'Bağcılar',
    city: 'İstanbul',
    ownerId: 'o1',
    tags: ['Popüler', 'Hızlı'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Pizza Hut',
    description: 'İtalyan lezzetleri',
    logo: 'https://placehold.co/80x80/ff8c00/white?text=PH',
    coverImage: 'https://placehold.co/400x200/ff8c00/white?text=Pizza+Hut',
    category: 'Pizza',
    categoryEmoji: '🍕',
    rating: 4.3,
    reviewCount: 1876,
    deliveryTime: 35,
    deliveryFee: 14.99,
    minOrder: 80,
    isOpen: true,
    isApproved: true,
    address: 'Kadıköy',
    district: 'Kadıköy',
    city: 'İstanbul',
    ownerId: 'o2',
    tags: ['İndirimli'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Dönerci Ahmet Usta',
    description: 'Geleneksel Türk mutfağı',
    logo: 'https://placehold.co/80x80/2c3e50/white?text=DA',
    coverImage: 'https://placehold.co/400x200/2c3e50/white?text=Dönerci',
    category: 'Döner',
    categoryEmoji: '🌯',
    rating: 4.8,
    reviewCount: 4201,
    deliveryTime: 20,
    deliveryFee: 7.99,
    minOrder: 40,
    isOpen: true,
    isApproved: true,
    address: 'Beşiktaş',
    district: 'Beşiktaş',
    city: 'İstanbul',
    ownerId: 'o3',
    tags: ['En Çok Sipariş', 'Yeni'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Sushi Palace',
    description: 'Japon mutfağının en iyisi',
    logo: 'https://placehold.co/80x80/1a1a2e/white?text=SP',
    coverImage: 'https://placehold.co/400x200/1a1a2e/white?text=Sushi+Palace',
    category: 'Sushi',
    categoryEmoji: '🍱',
    rating: 4.6,
    reviewCount: 987,
    deliveryTime: 45,
    deliveryFee: 19.99,
    minOrder: 120,
    isOpen: false,
    isApproved: true,
    address: 'Şişli',
    district: 'Şişli',
    city: 'İstanbul',
    ownerId: 'o4',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Kahve Dünyası',
    description: 'Her sabah taze kahve',
    logo: 'https://placehold.co/80x80/6f4e37/white?text=KD',
    coverImage: 'https://placehold.co/400x200/6f4e37/white?text=Kahve+Dünyası',
    category: 'Kahve',
    categoryEmoji: '☕',
    rating: 4.4,
    reviewCount: 3120,
    deliveryTime: 20,
    deliveryFee: 5.99,
    minOrder: 30,
    isOpen: true,
    isApproved: true,
    address: 'Taksim',
    district: 'Beyoğlu',
    city: 'İstanbul',
    ownerId: 'o5',
    tags: ['Yeni'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Pasta Fabrikası',
    description: 'Taze pastalar ve tatlılar',
    logo: 'https://placehold.co/80x80/e91e8c/white?text=PF',
    coverImage: 'https://placehold.co/400x200/e91e8c/white?text=Pasta+Fabrikası',
    category: 'Tatlı',
    categoryEmoji: '🍰',
    rating: 4.7,
    reviewCount: 1543,
    deliveryTime: 30,
    deliveryFee: 12.99,
    minOrder: 60,
    isOpen: true,
    isApproved: true,
    address: 'Ümraniye',
    district: 'Ümraniye',
    city: 'İstanbul',
    ownerId: 'o6',
    createdAt: new Date().toISOString(),
  },
];

export default function HomePage() {
  const [address, setAddress] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = selectedCategory
    ? FEATURED_RESTAURANTS.filter((r) => r.category === selectedCategory)
    : FEATURED_RESTAURANTS;

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-[#c0110e] to-[#8b0000] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto">
            {/* Logo wordmark */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl">🍽️</span>
              <h1 className="text-6xl md:text-7xl font-black tracking-tight">
                Sipari<span className="text-orange">m</span>
              </h1>
            </div>
            <p className="text-2xl md:text-3xl font-semibold text-white/90 mb-2">
              Yemeğin Kapında 🍔
            </p>
            <p className="text-white/70 text-lg mb-10">
              Binlerce restorandan dilediğini seç, hızlıca kapına gelsin.
            </p>

            {/* Address Search */}
            <div className="bg-white rounded-2xl p-2 flex items-center gap-2 shadow-2xl max-w-xl mx-auto">
              <div className="flex-1 flex items-center gap-2 px-3">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Adresinizi girin veya konumunuzu paylaşın..."
                  className="flex-1 text-gray-800 text-sm py-3 focus:outline-none placeholder-gray-400"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <Link
                href={`/restaurants${address ? `?address=${encodeURIComponent(address)}` : ''}`}
                className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap"
              >
                Restoran Bul
              </Link>
            </div>

            {/* Konum Seçici */}
            <div className="flex justify-center mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <LocationPicker className="text-white [&_button]:text-white [&_svg]:text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="overflow-hidden">
          <svg viewBox="0 0 1440 48" className="w-full fill-gray-50" preserveAspectRatio="none">
            <path d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z" />
          </svg>
        </div>
      </section>

      {/* Category Pills */}
      <section className="bg-gray-50 pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Kategoriler</h2>
          <CategoryFilter
            selected={selectedCategory}
            onSelect={(cat) => setSelectedCategory(cat === selectedCategory ? '' : cat)}
          />
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            {[
              { value: '1.200+', label: 'Restoran' },
              { value: '30 dk', label: 'Ort. Teslimat' },
              { value: '4.8 ⭐', label: 'Müşteri Puanı' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-2xl font-black text-primary">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCategory ? `${selectedCategory} Restoranları` : 'Öne Çıkan Restoranlar'}
          </h2>
          <Link href="/restaurants" className="text-primary font-semibold text-sm hover:underline">
            Tümünü Gör →
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl">😕</span>
            <p className="mt-4 text-lg">Bu kategoride restoran bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </main>

      {/* App download banner */}
      <section className="bg-gradient-to-r from-primary to-orange mx-4 md:mx-auto md:max-w-6xl rounded-3xl my-8 p-8 md:p-12 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black mb-2">Siparim Uygulamasını İndir</h3>
            <p className="text-white/80">Daha hızlı sipariş, özel indirimler ve canlı takip!</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-black text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-gray-900 transition">
              <span className="text-xl">🍎</span> App Store
            </button>
            <button className="bg-black text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-gray-900 transition">
              <span className="text-xl">🤖</span> Google Play
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
