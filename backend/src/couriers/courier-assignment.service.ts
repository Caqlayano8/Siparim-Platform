import { Injectable, Logger } from '@nestjs/common';
import { CouriersService } from './couriers.service';
import { OrdersService } from '../orders/orders.service';
import { AppGateway } from '../gateway/app.gateway';

@Injectable()
export class CourierAssignmentService {
  private readonly logger = new Logger(CourierAssignmentService.name);
  private pendingAssignments = new Map<string, NodeJS.Timeout>();

  constructor(
    private couriersService: CouriersService,
    private ordersService: OrdersService,
    private appGateway: AppGateway,
  ) {}

  async assignCourierToOrder(orderId: string): Promise<void> {
    const order = await this.ordersService.findById(orderId);
    const restaurant = order.restaurant;

    const restaurantLat = Number(restaurant.latitude);
    const restaurantLon = Number(restaurant.longitude);

    const nearbyCouriers = await this.couriersService.findOnlineCouriersNear(
      restaurantLat,
      restaurantLon,
      3,
    );

    if (nearbyCouriers.length === 0) {
      this.logger.warn(`No couriers available for order ${orderId}`);
      this.appGateway.notifyRestaurant(restaurant.owner.id, 'no_couriers_available', { orderId });
      return;
    }

    await this.offerToNextCourier(orderId, nearbyCouriers, 0, restaurantLat, restaurantLon);
  }

  private async offerToNextCourier(
    orderId: string,
    couriers: any[],
    index: number,
    restaurantLat: number,
    restaurantLon: number,
  ): Promise<void> {
    if (index >= couriers.length) {
      this.logger.warn(`All couriers rejected order ${orderId}`);
      const order = await this.ordersService.findById(orderId);
      this.appGateway.notifyRestaurant(order.restaurant.owner.id, 'no_couriers_available', { orderId });
      return;
    }

    const courier = couriers[index];
    const distance = this.couriersService.haversineDistance(
      restaurantLat,
      restaurantLon,
      Number(courier.currentLatitude),
      Number(courier.currentLongitude),
    );
    const earning = this.couriersService.calculateEarning(distance);

    this.logger.log(`Offering order ${orderId} to courier ${courier.id} (${distance.toFixed(2)}km, ${earning}TL)`);

    this.appGateway.offerOrderToCourier(courier.user.id, {
      orderId,
      earning,
      distance: Math.round(distance * 100) / 100,
      timeout: 15,
    });

    const timeout = setTimeout(async () => {
      this.pendingAssignments.delete(`${orderId}_${courier.id}`);
      this.logger.log(`Courier ${courier.id} timed out for order ${orderId}, trying next`);
      await this.offerToNextCourier(orderId, couriers, index + 1, restaurantLat, restaurantLon);
    }, 15000);

    this.pendingAssignments.set(`${orderId}_${courier.id}`, timeout);
  }

  async handleCourierResponse(
    orderId: string,
    courierId: string,
    accepted: boolean,
  ): Promise<void> {
    const key = `${orderId}_${courierId}`;
    const timeout = this.pendingAssignments.get(key);

    if (!timeout) {
      this.logger.warn(`No pending assignment found for key ${key}`);
      return;
    }

    clearTimeout(timeout);
    this.pendingAssignments.delete(key);

    if (!accepted) {
      this.logger.log(`Courier ${courierId} rejected order ${orderId}`);
      return;
    }

    const order = await this.ordersService.findById(orderId);
    if (order.status !== 'ready') {
      this.logger.warn(`Order ${orderId} is no longer in ready status`);
      return;
    }

    const courier = await this.couriersService.findById(courierId);
    const restaurantLat = Number(order.restaurant.latitude);
    const restaurantLon = Number(order.restaurant.longitude);
    const distance = this.couriersService.haversineDistance(
      restaurantLat,
      restaurantLon,
      Number(courier.currentLatitude),
      Number(courier.currentLongitude),
    );
    const earning = this.couriersService.calculateEarning(distance);

    const updatedOrder = await this.ordersService.assignCourier(orderId, courierId, earning);
    await this.couriersService.addEarning(courierId, earning);

    this.appGateway.notifyOrderStatusChange(updatedOrder);
    this.logger.log(`Courier ${courierId} assigned to order ${orderId}`);
  }
}
