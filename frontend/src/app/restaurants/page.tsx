'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantCard from '@/components/RestaurantCard';
import CategoryFilter from '@/components/CategoryFilter';
import CartSidebar from '@/components/CartSidebar';
import { restaurantsApi } from '@/lib/api';
import { Restaurant } from '@/types';

const SORT_OPTIONS = [
  { value: 'rating', label: '⭐ En Yüksek Puan' },
  { value: 'delivery_time', label: '⚡ En Hızlı Teslimat' },
  { value: 'delivery_fee', label: '🆓 En Düşük Teslimat Ücreti' },
  { value: 'min_order', label: '💸 En Düşük Min. Sipariş' },
];

// Mock data for demonstration
const MOCK_RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Burger King', logo: 'https://placehold.co/80x80/e8231a/white?text=BK', coverImage: 'https://placehold.co/400x200/e8231a/white?text=BK', category: 'Burger', categoryEmoji: '🍔', rating: 4.5, reviewCount: 2341, deliveryTime: 25, deliveryFee: 9.99, minOrder: 50, isOpen: true, isApproved: true, address: 'Bağcılar', district: 'Bağcılar', city: 'İstanbul', ownerId: 'o1', tags: ['Popüler'], createdAt: new Date().toISOString() },
  { id: '2', name: 'Pizza Hut', logo: 'https://placehold.co/80x80/ff8c00/white?text=PH', coverImage: 'https://placehold.co/400x200/ff8c00/white?text=PH', category: 'Pizza', categoryEmoji: '🍕', rating: 4.3, reviewCount: 1876, deliveryTime: 35, deliveryFee: 14.99, minOrder: 80, isOpen: true, isApproved: true, address: 'Kadıköy', district: 'Kadıköy', city: 'İstanbul', ownerId: 'o2', tags: ['İndirimli'], createdAt: new Date().toISOString() },
  { id: '3', name: 'Dönerci Ahmet', logo: 'https://placehold.co/80x80/2c3e50/white?text=DA', coverImage: 'https://placehold.co/400x200/2c3e50/white?text=DA', category: 'Döner', categoryEmoji: '🌯', rating: 4.8, reviewCount: 4201, deliveryTime: 20, deliveryFee: 7.99, minOrder: 40, isOpen: true, isApproved: true, address: 'Beşiktaş', district: 'Beşiktaş', city: 'İstanbul', ownerId: 'o3', tags: ['En Çok Sipariş'], createdAt: new Date().toISOString() },
  { id: '4', name: 'McDonald\'s', logo: 'https://placehold.co/80x80/ffd700/red?text=MC', coverImage: 'https://placehold.co/400x200/ffd700/red?text=MC', category: 'Burger', categoryEmoji: '🍔', rating: 4.1, reviewCount: 5678, deliveryTime: 30, deliveryFee: 0, minOrder: 60, isOpen: true, isApproved: true, address: 'Mecidiyeköy', district: 'Şişli', city: 'İstanbul', ownerId: 'o4', tags: ['Ücretsiz Teslimat'], createdAt: new Date().toISOString() },
  { id: '5', name: 'Kahve Dünyası', logo: 'https://placehold.co/80x80/6f4e37/white?text=KD', coverImage: 'https://placehold.co/400x200/6f4e37/white?text=KD', category: 'Kahve', categoryEmoji: '☕', rating: 4.4, reviewCount: 3120, deliveryTime: 20, deliveryFee: 5.99, minOrder: 30, isOpen: true, isApproved: true, address: 'Taksim', district: 'Beyoğlu', city: 'İstanbul', ownerId: 'o5', createdAt: new Date().toISOString() },
  { id: '6', name: 'Sushi Palace', logo: 'https://placehold.co/80x80/1a1a2e/white?text=SP', coverImage: 'https://placehold.co/400x200/1a1a2e/white?text=SP', category: 'Sushi', categoryEmoji: '🍱', rating: 4.6, reviewCount: 987, deliveryTime: 45, deliveryFee: 19.99, minOrder: 120, isOpen: false, isApproved: true, address: 'Şişli', district: 'Şişli', city: 'İstanbul', ownerId: 'o6', createdAt: new Date().toISOString() },
  { id: '7', name: 'Pasta Fabrikası', logo: 'https://placehold.co/80x80/e91e8c/white?text=PF', coverImage: 'https://placehold.co/400x200/e91e8c/white?text=PF', category: 'Tatlı', categoryEmoji: '🍰', rating: 4.7, reviewCount: 1543, deliveryTime: 30, deliveryFee: 12.99, minOrder: 60, isOpen: true, isApproved: true, address: 'Ümraniye', district: 'Ümraniye', city: 'İstanbul', ownerId: 'o7', createdAt: new Date().toISOString() },
  { id: '8', name: 'Pide Ustası', logo: 'https://placehold.co/80x80/8b4513/white?text=PU', coverImage: 'https://placehold.co/400x200/8b4513/white?text=PU', category: 'Pide', categoryEmoji: '🥙', rating: 4.5, reviewCount: 2100, deliveryTime: 25, deliveryFee: 8.99, minOrder: 45, isOpen: true, isApproved: true, address: 'Fatih', district: 'Fatih', city: 'İstanbul', ownerId: 'o8', createdAt: new Date().toISOString() },
];

export default function RestaurantsPage() {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [cartOpen, setCartOpen] = useState(false);
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  useEffect(() => {
    // In production, fetch from API:
    // setLoading(true);
    // restaurantsApi.getAll({ category: selectedCategory, search }).then(res => setRestaurants(res.data.data)).finally(() => setLoading(false));
  }, [selectedCategory, search]);

  const filtered = restaurants
    .filter((r) => {
      if (selectedCategory && r.category !== selectedCategory) return false;
      if (showOpenOnly && !r.isOpen) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery_time') return a.deliveryTime - b.deliveryTime;
      if (sortBy === 'delivery_fee') return a.deliveryFee - b.deliveryFee;
      if (sortBy === 'min_order') return a.minOrder - b.minOrder;
      return 0;
    });

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-800">Restoranlar</h1>
          <p className="text-gray-400 text-sm mt-1">
            {filtered.length} restoran bulundu
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Restoran ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field md:w-56"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-primary transition-colors">
            <input
              type="checkbox"
              className="accent-primary"
              checked={showOpenOnly}
              onChange={(e) => setShowOpenOnly(e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sadece Açık</span>
          </label>
        </div>

        {/* Category filter */}
        <div className="mb-6">
          <CategoryFilter
            selected={selectedCategory}
            onSelect={(cat) => setSelectedCategory(cat === selectedCategory ? '' : cat)}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">🍽️</span>
            <p className="text-xl font-semibold text-gray-600 mt-4">Restoran bulunamadı</p>
            <p className="text-gray-400 mt-2">Farklı bir kategori veya arama terimi deneyin.</p>
            <button onClick={() => { setSearch(''); setSelectedCategory(''); }} className="btn-primary mt-5 text-sm">
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
