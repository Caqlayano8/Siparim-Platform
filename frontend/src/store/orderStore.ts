// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
import { create } from 'zustand';
import { Order, OrderStatus } from '@/types';

interface OrderStore {
  currentOrder: Order | null;
  orders: Order[];
  isTracking: boolean;

  setCurrentOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  setTracking: (tracking: boolean) => void;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderStore>()((set, get) => ({
  currentOrder: null,
  orders: [],
  isTracking: false,

  setCurrentOrder: (order) => set({ currentOrder: order }),

  updateOrderStatus: (orderId, status) => {
    const { currentOrder, orders } = get();

    const updatedOrders = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status,
            statusHistory: [
              ...o.statusHistory,
              { status, timestamp: new Date().toISOString() },
            ],
          }
        : o
    );

    set({
      orders: updatedOrders,
      currentOrder:
        currentOrder?.id === orderId
          ? {
              ...currentOrder,
              status,
              statusHistory: [
                ...currentOrder.statusHistory,
                { status, timestamp: new Date().toISOString() },
              ],
            }
          : currentOrder,
    });
  },

  setOrders: (orders) => set({ orders }),

  addOrder: (order) => set({ orders: [order, ...get().orders] }),

  setTracking: (isTracking) => set({ isTracking }),

  clearCurrentOrder: () => set({ currentOrder: null, isTracking: false }),
}));
