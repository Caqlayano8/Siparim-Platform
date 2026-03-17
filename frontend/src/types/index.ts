// (c) C.Kurtoglu - Siparim Platform - Bu dosya Caglayan KURTOGLU tarafindan yapilmistir. Yetkisiz kopyalama yasaktir.
export type UserRole = 'customer' | 'restaurant_owner' | 'courier' | 'admin';

export interface User {
  id: string;
  name?: string;          // computed: firstName + lastName
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  addresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  title: string; // Ev, İş, etc.
  fullAddress: string;
  district: string;
  city: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  slug: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  category: string;
  categoryEmoji?: string;
  rating: number;
  reviewCount: number;
  deliveryTime: number; // minutes
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  isApproved: boolean;
  address: string;
  district: string;
  city: string;
  ownerId: string;
  tags?: string[];
  createdAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  restaurantId: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  restaurantId: string;
  isAvailable: boolean;
  preparationTime?: number;
  allergens?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'on_way'
  | 'delivered'
  | 'cancelled'
  | 'rejected';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  restaurantId: string;
  restaurantName?: string;
  courierId?: string;
  courierName?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  address: Address;
  promoCode?: string;
  note?: string;
  estimatedDelivery?: string;
  statusHistory: StatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Courier {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isApproved: boolean;
  isActive: boolean;
  vehicleType: 'motorcycle' | 'bicycle' | 'car';
  rating?: number;
  totalDeliveries?: number;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder?: number;
  maxDiscount?: number;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
}

export interface DashboardStats {
  totalRestaurants: number;
  totalCouriers: number;
  todayOrders: number;
  todayRevenue: number;
  pendingApprovals: number;
  activeOrders: number;
}

export interface RestaurantDashboard {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  rating: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export interface EarningsReport {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  commissionPaid: number;
  netEarnings: number;
  dailyData: { date: string; revenue: number; orders: number }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
