// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

// © C.Kurtoglu - Siparim Platform - Tüm hakları saklıdır.
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantCard from '@/components/RestaurantCard';
import CategoryFilter from '@/components/CategoryFilter';
import CartSidebar from '@/components/CartSidebar';
import LocationPicker from '@/components/LocationPicker';
import WelcomeBanner from '@/components/WelcomeBanner';
import { restaurantsApi } from '@/lib/api';
import { Restaurant } from '@/types';

const SORT_OPTIONS = [
  { value: 'rating', label: '⭐ En Yüksek Puan' },
  { value: 'delivery_time', label: '⚡ En Hızlı Teslimat' },
  { value: 'delivery_fee', label: '🆓 En Düşük Teslimat Ücreti' },
  { value: 'min_order', label: '💸 En Düşük Min. Sipariş' },
];

const CUISINES = ['Döner', 'Pizza', 'Burger', 'Kahve', 'Sushi', 'Tatlı', 'Pide', 'Kahvaltı', 'Lahmacun', 'Kebap', 'Balık', 'Vegan'];

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
  return (
    <Suspense>
      <RestaurantsContent />
    </Suspense>
  );
}

function RestaurantsContent() {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [cartOpen, setCartOpen] = useState(false);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Sidebar filter states
  const [sideSort, setSideSort] = useState('recommended');
  const [quickFilters, setQuickFilters] = useState({ coupon: false, newJoin: false, freeDelivery: false });
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [showMoreCuisines, setShowMoreCuisines] = useState(false);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [deliverySpeed, setDeliverySpeed] = useState<string[]>([]);

  // Fetch real data from API with fallback to mock data
  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await restaurantsApi.getAll({ limit: 100 });
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRestaurants(res.data.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name || ''),
          description: r.description ? String(r.description) : undefined,
          logo: r.logoUrl ? String(r.logoUrl) : (r.logo ? String(r.logo) : undefined),
          coverImage: r.coverImage ? String(r.coverImage) : undefined,
          category: String(r.category || 'Diğer'),
          categoryEmoji: r.categoryEmoji ? String(r.categoryEmoji) : '🍽️',
          rating: Number(r.rating) || 0,
          reviewCount: Number(r.reviewCount) || 0,
          deliveryTime: Number(r.estimatedDeliveryTime) || 30,
          deliveryFee: Number(r.deliveryFee) || 0,
          minOrder: Number(r.minimumOrderAmount) || 0,
          isOpen: Boolean(r.isOpen),
          isApproved: r.status === 'approved',
          address: String(r.address || ''),
          district: String(r.district || ''),
          city: String(r.city || ''),
          ownerId: String(r.ownerId || ''),
          tags: Array.isArray(r.tags) ? r.tags.map(String) : [],
          createdAt: String(r.createdAt || new Date().toISOString()),
        })));
      }
    } catch {
      // Keep current data (mock or previously fetched)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchRestaurants();
    // Poll every 60 seconds for real-time admin changes
    const interval = setInterval(fetchRestaurants, 60000);
    return () => clearInterval(interval);
  }, [fetchRestaurants]);

  useEffect(() => {
    const saved = localStorage.getItem('siparim_location');
    if (saved) {
      try {
        const { city, district } = JSON.parse(saved);
        if (city) setSelectedCity(city);
        if (district) setSelectedDistrict(district);
      } catch {}
    }
  }, []);

  const toggleCuisine = (c: string) =>
    setSelectedCuisines((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const togglePrice = (p: string) =>
    setPriceRanges((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const toggleDelivery = (d: string) =>
    setDeliverySpeed((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  const filteredCuisines = CUISINES.filter((c) =>
    c.toLowerCase().includes(cuisineSearch.toLowerCase())
  );
  const visibleCuisines = showMoreCuisines ? filteredCuisines : filteredCuisines.slice(0, 6);

  const filtered = restaurants
    .filter((r) => {
      if (selectedCategory && r.category !== selectedCategory) return false;
      if (showOpenOnly && !r.isOpen) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCity && r.city && r.city !== selectedCity) return false;
      if (selectedDistrict && r.district && r.district !== selectedDistrict) return false;
      if (quickFilters.freeDelivery && r.deliveryFee !== 0) return false;
      if (quickFilters.newJoin && !r.tags?.includes('Yeni')) return false;
      if (quickFilters.coupon && !r.tags?.includes('Kupon')) return false;
      if (selectedCuisines.length > 0 && !selectedCuisines.includes(r.category)) return false;
      if (priceRanges.length > 0) {
        const inRange = priceRanges.some((range) => {
          if (range === '0-50') return r.minOrder <= 50;
          if (range === '50-100') return r.minOrder > 50 && r.minOrder <= 100;
          if (range === '100-150') return r.minOrder > 100 && r.minOrder <= 150;
          if (range === '150+') return r.minOrder > 150;
          return true;
        });
        if (!inRange) return false;
      }
      if (deliverySpeed.length > 0) {
        const fast = deliverySpeed.some((d) => {
          if (d === '30') return r.deliveryTime < 30;
          if (d === '45') return r.deliveryTime < 45;
          return true;
        });
        if (!fast) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const s = sideSort !== 'recommended' ? sideSort : sortBy;
      if (s === 'rating') return b.rating - a.rating;
      if (s === 'delivery_time') return a.deliveryTime - b.deliveryTime;
      if (s === 'delivery_fee') return a.deliveryFee - b.deliveryFee;
      if (s === 'min_order') return a.minOrder - b.minOrder;
      return 0;
    });

  const clearAll = () => {
    setSearch('');
    setSelectedCategory('');
    setSideSort('recommended');
    setQuickFilters({ coupon: false, newJoin: false, freeDelivery: false });
    setSelectedCuisines([]);
    setPriceRanges([]);
    setDeliverySpeed([]);
    setShowOpenOnly(false);
  };

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-black text-gray-800">Restoranlar</h1>
              <p className="text-gray-400 text-sm mt-1">{filtered.length} restoran bulundu</p>
            </div>
            <LocationPicker onLocationChange={(city, district) => { setSelectedCity(city); setSelectedDistrict(district); }} />
          </div>
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
          <select className="input-field md:w-56" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-primary transition-colors">
            <input type="checkbox" className="accent-primary" checked={showOpenOnly} onChange={(e) => setShowOpenOnly(e.target.checked)} />
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sadece Açık</span>
          </label>
        </div>

        {/* Category filter */}
        <div className="mb-6">
          <CategoryFilter selected={selectedCategory} onSelect={(cat) => setSelectedCategory(cat === selectedCategory ? '' : cat)} />
        </div>

        {/* Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-2xl p-5 shadow-sm lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-800">Filtrele</h2>
              <button onClick={clearAll} className="text-xs text-primary hover:underline font-semibold">Temizle</button>
            </div>

            {/* Sort */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sıralama</p>
              <div className="space-y-1.5">
                {[
                  { value: 'recommended', label: 'Önerilen (Varsayılan)' },
                  { value: 'rating', label: 'Restoran Puanı' },
                  { value: 'delivery_time', label: 'Teslimat Süresi' },
                  { value: 'delivery_fee', label: 'Teslimat Ücreti' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="sideSort"
                      value={opt.value}
                      checked={sideSort === opt.value}
                      onChange={() => setSideSort(opt.value)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Hızlı Filtreler</p>
              <div className="space-y-1.5">
                {[
                  { key: 'coupon', label: 'Kupon kabul ediyor' },
                  { key: 'newJoin', label: 'Yeni katılım' },
                  { key: 'freeDelivery', label: 'Ücretsiz teslimat' },
                ].map((f) => (
                  <label key={f.key} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="accent-primary w-4 h-4"
                      checked={quickFilters[f.key as keyof typeof quickFilters]}
                      onChange={() => setQuickFilters((p) => ({ ...p, [f.key]: !p[f.key as keyof typeof p] }))}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cuisine */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Mutfak</p>
              <div className="relative mb-2">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                <input
                  type="text"
                  placeholder="Mutfak ara"
                  value={cuisineSearch}
                  onChange={(e) => setCuisineSearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                {visibleCuisines.map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="accent-primary w-4 h-4"
                      checked={selectedCuisines.includes(c)}
                      onChange={() => toggleCuisine(c)}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{c}</span>
                  </label>
                ))}
              </div>
              {filteredCuisines.length > 6 && (
                <button
                  onClick={() => setShowMoreCuisines(!showMoreCuisines)}
                  className="mt-2 text-xs text-primary hover:underline font-semibold"
                >
                  {showMoreCuisines ? 'Daha az göster ↑' : 'Daha fazla göster ↓'}
                </button>
              )}
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Fiyat Aralığı</p>
              <div className="space-y-1.5">
                {[
                  { value: '0-50', label: '0-50 TL' },
                  { value: '50-100', label: '50-100 TL' },
                  { value: '100-150', label: '100-150 TL' },
                  { value: '150+', label: '150+ TL' },
                ].map((p) => (
                  <label key={p.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="accent-primary w-4 h-4"
                      checked={priceRanges.includes(p.value)}
                      onChange={() => togglePrice(p.value)}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery Speed */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Teslimat Süresi</p>
              <div className="space-y-1.5">
                {[
                  { value: '30', label: "30 dk'dan hızlı" },
                  { value: '45', label: "45 dk'dan hızlı" },
                ].map((d) => (
                  <label key={d.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="accent-primary w-4 h-4"
                      checked={deliverySpeed.includes(d.value)}
                      onChange={() => toggleDelivery(d.value)}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{d.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Restaurant Grid */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
                <button onClick={clearAll} className="btn-primary mt-5 text-sm">Filtreleri Temizle</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <WelcomeBanner />
    </>
  );
}

