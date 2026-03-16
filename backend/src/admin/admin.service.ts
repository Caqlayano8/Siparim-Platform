import { Injectable } from '@nestjs/common';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { CouriersService } from '../couriers/couriers.service';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class AdminService {
  constructor(
    private restaurantsService: RestaurantsService,
    private couriersService: CouriersService,
    private usersService: UsersService,
    private ordersService: OrdersService,
  ) {}

  async getPendingRestaurants() {
    const all = await this.restaurantsService.findAll(false);
    return all.filter((r) => r.status === 'pending');
  }

  async approveRestaurant(id: string) {
    return this.restaurantsService.approve(id);
  }

  async rejectRestaurant(id: string) {
    return this.restaurantsService.reject(id);
  }

  async suspendRestaurant(id: string) {
    return this.restaurantsService.suspend(id);
  }

  async getPendingCouriers() {
    const all = await this.couriersService.findAll();
    return all.filter((c) => c.status === 'pending');
  }

  async approveCourier(id: string) {
    return this.couriersService.approve(id);
  }

  async rejectCourier(id: string) {
    return this.couriersService.reject(id);
  }

  async suspendCourier(id: string) {
    return this.couriersService.suspend(id);
  }

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async deactivateUser(id: string) {
    return this.usersService.deactivate(id);
  }

  async getAllRestaurants() {
    return this.restaurantsService.findAll(false);
  }

  async getAllCouriers() {
    return this.couriersService.findAll();
  }

  async getStats() {
    const users = await this.usersService.findAll();
    const restaurants = await this.restaurantsService.findAll(false);
    const couriers = await this.couriersService.findAll();
    const orderStats = await this.ordersService.getStats();

    return {
      users: {
        total: users.length,
        customers: users.filter((u) => u.role === 'customer').length,
        restaurantOwners: users.filter((u) => u.role === 'restaurant_owner').length,
        couriers: users.filter((u) => u.role === 'courier').length,
        admins: users.filter((u) => u.role === 'admin').length,
      },
      restaurants: {
        total: restaurants.length,
        pending: restaurants.filter((r) => r.status === 'pending').length,
        approved: restaurants.filter((r) => r.status === 'approved').length,
        rejected: restaurants.filter((r) => r.status === 'rejected').length,
        suspended: restaurants.filter((r) => r.status === 'suspended').length,
      },
      couriers: {
        total: couriers.length,
        pending: couriers.filter((c) => c.status === 'pending').length,
        approved: couriers.filter((c) => c.status === 'approved').length,
        online: couriers.filter((c) => c.isOnline).length,
      },
      orders: orderStats,
    };
  }
}
