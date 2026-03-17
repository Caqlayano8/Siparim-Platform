// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem, Restaurant } from '@/types';

interface CartStore {
  items: CartItem[];
  restaurant: Restaurant | null;
  promoCode: string;
  discount: number;

  addItem: (item: MenuItem, restaurant: Restaurant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setPromoCode: (code: string, discount: number) => void;
  clearPromo: () => void;

  // Computed
  itemCount: () => number;
  subtotal: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurant: null,
      promoCode: '',
      discount: 0,

      addItem: (menuItem, restaurant) => {
        const { items, restaurant: currentRestaurant } = get();

        // Clear cart if different restaurant
        if (currentRestaurant && currentRestaurant.id !== restaurant.id) {
          set({ items: [{ menuItem, quantity: 1 }], restaurant, promoCode: '', discount: 0 });
          return;
        }

        const existing = items.find((i) => i.menuItem.id === menuItem.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            restaurant,
          });
        } else {
          set({ items: [...items, { menuItem, quantity: 1 }], restaurant });
        }
      },

      removeItem: (itemId) => {
        const items = get().items.filter((i) => i.menuItem.id !== itemId);
        set({ items, restaurant: items.length === 0 ? null : get().restaurant });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.menuItem.id === itemId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [], restaurant: null, promoCode: '', discount: 0 }),

      setPromoCode: (code, discount) => set({ promoCode: code, discount }),

      clearPromo: () => set({ promoCode: '', discount: 0 }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),

      total: () => {
        const { restaurant } = get();
        const subtotal = get().subtotal();
        const deliveryFee = restaurant?.deliveryFee ?? 0;
        const discount = get().discount;
        return Math.max(0, subtotal + deliveryFee - discount);
      },
    }),
    {
      name: 'siparim-cart',
    }
  )
);
