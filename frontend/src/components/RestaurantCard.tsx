// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
import Link from 'next/link';
import { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`} className="card block group overflow-hidden">
      {/* Cover image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {restaurant.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-primary-light to-orange-light">
            {restaurant.categoryEmoji || '🍽️'}
          </div>
        )}

        {/* Status badge */}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-black/70 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
              Şu an kapalı
            </span>
          </div>
        )}

        {/* Tags */}
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1.5">
            {restaurant.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                  tag === 'Popüler' || tag === 'En Çok Sipariş'
                    ? 'bg-primary text-white'
                    : tag === 'İndirimli'
                    ? 'bg-orange text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Delivery fee */}
        <div className="absolute bottom-3 right-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
            restaurant.deliveryFee === 0 ? 'bg-green-500 text-white' : 'bg-white/90 text-gray-700'
          }`}>
            {restaurant.deliveryFee === 0 ? 'Ücretsiz Teslimat' : `${restaurant.deliveryFee.toFixed(2)} ₺ Teslimat`}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            {restaurant.logo && (
              <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 truncate group-hover:text-primary transition-colors">
                {restaurant.name}
              </h3>
              <p className="text-xs text-gray-400 truncate">{restaurant.district}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg flex-shrink-0">
            <span className="text-yellow-400 text-xs">⭐</span>
            <span className="text-xs font-bold text-green-700">{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {restaurant.deliveryTime} dk
          </span>
          <span className="text-gray-300">•</span>
          <span>Min. {restaurant.minOrder} ₺</span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-0.5">
            {restaurant.categoryEmoji} {restaurant.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
