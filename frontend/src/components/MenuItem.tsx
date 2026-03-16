'use client';

import Image from 'next/image';
import toast from 'react-hot-toast';
import { MenuItem as MenuItemType, Restaurant } from '@/types';
import { useCartStore } from '@/store/cartStore';

interface MenuItemProps {
  item: MenuItemType;
  restaurant: Restaurant;
}

export default function MenuItem({ item, restaurant }: MenuItemProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem(item, restaurant);
    toast.success(`${item.name} sepete eklendi!`, { icon: '🛒' });
  };

  return (
    <div className={`flex gap-3 p-3 bg-white rounded-2xl border transition-all ${
      item.isAvailable ? 'border-gray-100 hover:border-primary/20 hover:shadow-sm' : 'border-gray-100 opacity-60'
    }`}>
      {/* Image */}
      {item.image && (
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800 text-sm leading-tight">{item.name}</h4>
        {item.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
        )}
        {item.preparationTime && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {item.preparationTime} dk
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary">{item.price.toFixed(2)} ₺</span>

          {!item.isAvailable ? (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
              Mevcut değil
            </span>
          ) : quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg hover:bg-primary-hover transition-colors active:scale-90"
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="w-7 h-7 rounded-full border-2 border-primary text-primary font-bold flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                −
              </button>
              <span className="w-5 text-center font-bold text-sm text-gray-800">{quantity}</span>
              <button
                onClick={() => { addItem(item, restaurant); }}
                className="w-7 h-7 rounded-full bg-primary text-white font-bold flex items-center justify-center hover:bg-primary-hover transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
