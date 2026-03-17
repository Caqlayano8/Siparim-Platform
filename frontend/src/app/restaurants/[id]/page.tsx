// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuItemComponent from '@/components/MenuItem';
import CartSidebar from '@/components/CartSidebar';
import { restaurantsApi } from '@/lib/api';
import { Restaurant, MenuItem, MenuCategory } from '@/types';
import { useCartStore } from '@/store/cartStore';

// Mock data
const MOCK_RESTAURANT: Restaurant = {
  id: '1',
  name: 'Burger King',
  description: 'Alev ızgara lezzetini sunuyoruz. 1954\'ten beri aynı kalitede.',
  logo: 'https://placehold.co/80x80/e8231a/white?text=BK',
  coverImage: 'https://placehold.co/1200x400/e8231a/white?text=Burger+King',
  category: 'Burger',
  categoryEmoji: '🍔',
  rating: 4.5,
  reviewCount: 2341,
  deliveryTime: 25,
  deliveryFee: 9.99,
  minOrder: 50,
  isOpen: true,
  isApproved: true,
  address: 'Bağcılar Mah. No:12',
  district: 'Bağcılar',
  city: 'İstanbul',
  ownerId: 'o1',
  tags: ['Popüler', 'Hızlı'],
  createdAt: new Date().toISOString(),
};

const MOCK_CATEGORIES: MenuCategory[] = [
  { id: 'c1', name: 'Burgerler', restaurantId: '1', sortOrder: 1 },
  { id: 'c2', name: 'Tavuklar', restaurantId: '1', sortOrder: 2 },
  { id: 'c3', name: 'Menüler', restaurantId: '1', sortOrder: 3 },
  { id: 'c4', name: 'Atıştırmalıklar', restaurantId: '1', sortOrder: 4 },
  { id: 'c5', name: 'İçecekler', restaurantId: '1', sortOrder: 5 },
];

const MOCK_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Whopper', description: 'Alev ızgara beef patty, marul, domates, soğan, mayonez', price: 89.90, image: 'https://placehold.co/200x150/e8231a/white?text=Whopper', categoryId: 'c1', restaurantId: '1', isAvailable: true, preparationTime: 8 },
  { id: 'm2', name: 'Double Whopper', description: 'Çift katlı alev ızgara burger', price: 119.90, image: 'https://placehold.co/200x150/c0110e/white?text=Double', categoryId: 'c1', restaurantId: '1', isAvailable: true, preparationTime: 10 },
  { id: 'm3', name: 'Cheeseburger', description: 'Klasik cheeseburger', price: 49.90, image: 'https://placehold.co/200x150/ff8c00/white?text=Cheese', categoryId: 'c1', restaurantId: '1', isAvailable: true, preparationTime: 6 },
  { id: 'm4', name: 'Crispy Chicken', description: 'Çıtır tavuk burger', price: 79.90, image: 'https://placehold.co/200x150/2c3e50/white?text=Crispy', categoryId: 'c2', restaurantId: '1', isAvailable: true, preparationTime: 10 },
  { id: 'm5', name: 'Chicken Royal', description: 'Özel sos ile tavuk burger', price: 94.90, image: 'https://placehold.co/200x150/1a1a2e/white?text=Royal', categoryId: 'c2', restaurantId: '1', isAvailable: true },
  { id: 'm6', name: 'Whopper Menü', description: 'Whopper + Orta Boy Patates + İçecek', price: 129.90, image: 'https://placehold.co/200x150/e8231a/white?text=Menü', categoryId: 'c3', restaurantId: '1', isAvailable: true, preparationTime: 12 },
  { id: 'm7', name: 'Chicken Menü', description: 'Crispy Chicken + Patates + İçecek', price: 114.90, categoryId: 'c3', restaurantId: '1', isAvailable: false },
  { id: 'm8', name: 'Soğan Halkası', description: 'Çıtır soğan halkaları (8 adet)', price: 39.90, categoryId: 'c4', restaurantId: '1', isAvailable: true },
  { id: 'm9', name: 'Patates Kızartması', description: 'Büyük boy patates', price: 34.90, categoryId: 'c4', restaurantId: '1', isAvailable: true },
  { id: 'm10', name: 'Cola', description: '500ml Coca-Cola', price: 24.90, categoryId: 'c5', restaurantId: '1', isAvailable: true },
  { id: 'm11', name: 'Ayran', description: 'Soğuk ayran 300ml', price: 19.90, categoryId: 'c5', restaurantId: '1', isAvailable: true },
];

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant] = useState<Restaurant>(MOCK_RESTAURANT);
  const [categories] = useState<MenuCategory[]>(MOCK_CATEGORIES);
  const [items] = useState<MenuItem[]>(MOCK_ITEMS);
  const [activeCategory, setActiveCategory] = useState('c1');
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  const itemsByCategory = (catId: string) => items.filter((i) => i.categoryId === catId);

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Cover */}
      <div className="relative h-56 md:h-72 bg-gray-200 overflow-hidden">
        {restaurant.coverImage ? (
          <Image src={restaurant.coverImage} alt={restaurant.name} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-primary-light to-orange-light">
            {restaurant.categoryEmoji}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10 pb-12">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            {restaurant.logo && (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                <Image src={restaurant.logo} alt={restaurant.name} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-gray-800">{restaurant.name}</h1>
                <span className={`badge text-xs ${restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {restaurant.isOpen ? '● Açık' : '● Kapalı'}
                </span>
              </div>
              {restaurant.description && (
                <p className="text-sm text-gray-500 mt-1">{restaurant.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="text-yellow-400">⭐</span>
                  <strong className="text-gray-800">{restaurant.rating.toFixed(1)}</strong>
                  <span className="text-gray-400">({restaurant.reviewCount.toLocaleString()})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {restaurant.deliveryTime} dk
                </span>
                <span className="flex items-center gap-1.5">
                  🛵 {restaurant.deliveryFee === 0 ? 'Ücretsiz Teslimat' : `${restaurant.deliveryFee.toFixed(2)} ₺`}
                </span>
                <span className="flex items-center gap-1.5">
                  💸 Min. {restaurant.minOrder} ₺
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Category sidebar (desktop) */}
          <div className="hidden md:block w-48 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm sticky top-20 overflow-hidden">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-l-4 ${
                    activeCategory === cat.id
                      ? 'bg-primary-light text-primary border-primary'
                      : 'text-gray-600 border-transparent hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                  <span className="ml-1 text-xs text-gray-400">
                    ({itemsByCategory(cat.id).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Mobile category tabs */}
            <div className="md:hidden flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {categories.map((cat) => {
              const catItems = itemsByCategory(cat.id);
              if (catItems.length === 0) return null;
              return (
                <section key={cat.id} id={`cat-${cat.id}`}>
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    {cat.name}
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {catItems.length} ürün
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {catItems.map((item) => (
                      <MenuItemComponent key={item.id} item={item} restaurant={restaurant} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating cart button (mobile) */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 md:hidden">
          <button
            onClick={() => setCartOpen(true)}
            className="bg-primary text-white px-6 py-3.5 rounded-2xl font-bold shadow-2xl flex items-center gap-3 animate-bounce-in"
          >
            <span className="bg-white/20 rounded-full w-7 h-7 flex items-center justify-center text-sm font-black">
              {itemCount}
            </span>
            Sepeti Görüntüle
            <span>🛒</span>
          </button>
        </div>
      )}

      <Footer />
    </>
  );
}
