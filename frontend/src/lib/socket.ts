import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('siparim_token') : null;

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Socket event names
export const SOCKET_EVENTS = {
  // Order events
  ORDER_NEW: 'order:new',
  ORDER_STATUS_UPDATED: 'order:status_updated',
  ORDER_ACCEPTED: 'order:accepted',
  ORDER_REJECTED: 'order:rejected',
  ORDER_PREPARING: 'order:preparing',
  ORDER_READY: 'order:ready',
  ORDER_ON_WAY: 'order:on_way',
  ORDER_DELIVERED: 'order:delivered',

  // Restaurant events
  RESTAURANT_JOIN: 'restaurant:join',

  // Courier events
  COURIER_LOCATION_UPDATE: 'courier:location_update',
} as const;

export const joinRestaurantRoom = (restaurantId: string) => {
  const s = getSocket();
  s.emit(SOCKET_EVENTS.RESTAURANT_JOIN, { restaurantId });
};
