import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { MenuService } from '../menu/menu.service';
import { User } from '../users/user.entity';
import { AppGateway } from '../gateway/app.gateway';
import { NotificationsService } from '../notifications/notifications.service';

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ['restaurant_accepted', 'cancelled'],
  restaurant_accepted: ['preparing', 'cancelled'],
  preparing: ['ready'],
  ready: ['courier_assigned'],
  courier_assigned: ['picked_up'],
  picked_up: ['delivered'],
  delivered: [],
  cancelled: [],
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    private restaurantsService: RestaurantsService,
    private menuService: MenuService,
    private appGateway: AppGateway,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateOrderDto, customer: Partial<User>): Promise<Order> {
    const restaurant = await this.restaurantsService.findById(dto.restaurantId);
    if (restaurant.status !== 'approved' || !restaurant.isOpen) {
      throw new BadRequestException('Restaurant is not accepting orders');
    }

    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const itemDto of dto.items) {
      const menuItem = await this.menuService.findById(itemDto.menuItemId);
      if (!menuItem.isAvailable) {
        throw new BadRequestException(`${menuItem.name} is not available`);
      }
      const totalPrice = Number(menuItem.price) * itemDto.quantity;
      subtotal += totalPrice;

      const orderItem = this.orderItemRepo.create({
        menuItem,
        quantity: itemDto.quantity,
        unitPrice: menuItem.price,
        totalPrice,
        notes: itemDto.notes,
        selectedOptions: itemDto.selectedOptions,
      });
      orderItems.push(orderItem);
    }

    const deliveryFee = Number(restaurant.deliveryFee) || 0;
    const totalAmount = subtotal + deliveryFee;

    const order = this.orderRepo.create({
      customer,
      restaurant,
      items: orderItems,
      subtotal,
      deliveryFee,
      totalAmount,
      deliveryAddress: dto.deliveryAddress,
      deliveryLatitude: dto.deliveryLatitude,
      deliveryLongitude: dto.deliveryLongitude,
      notes: dto.notes,
      status: 'pending',
    });

    const savedOrder = await this.orderRepo.save(order);

    const customerName = `${(customer as User).firstName || ''} ${(customer as User).lastName || ''}`.trim() || (customer as User).email || 'Müşteri';

    // Notify restaurant via WebSocket
    if (restaurant.owner?.id) {
      this.appGateway.notifyNewOrder(restaurant.owner.id, {
        id: savedOrder.id,
        totalAmount: savedOrder.totalAmount,
        customerName,
        itemCount: orderItems.length,
      });
    }

    // Send admin email + WhatsApp notification
    const notifyOrder = {
      id: savedOrder.id,
      restaurantName: restaurant.name,
      customerName,
      totalAmount: savedOrder.totalAmount,
      deliveryAddress: dto.deliveryAddress || '',
      items: orderItems.map((item) => ({
        name: item.menuItem?.name || 'Ürün',
        quantity: item.quantity,
      })),
    };
    this.notificationsService.sendOrderNotificationEmail(notifyOrder).catch(() => {});
    this.notificationsService.logWhatsAppLink(notifyOrder);

    return savedOrder;
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.menuItem', 'customer', 'restaurant', 'courier'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { customer: { id: customerId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByRestaurant(restaurantId: string, userId: string): Promise<Order[]> {
    const restaurant = await this.restaurantsService.findById(restaurantId);
    if (restaurant.owner.id !== userId) throw new ForbiddenException('Not your restaurant');
    return this.orderRepo.find({
      where: { restaurant: { id: restaurantId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCourier(courierId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { courier: { id: courierId } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    userId: string,
    role: string,
    cancelReason?: string,
  ): Promise<Order> {
    const order = await this.findById(orderId);
    const allowed = STATUS_FLOW[order.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(`Cannot transition from ${order.status} to ${newStatus}`);
    }

    if (newStatus === 'restaurant_accepted' || newStatus === 'preparing' || newStatus === 'ready') {
      if (role !== 'restaurant_owner' && role !== 'admin') {
        throw new ForbiddenException('Only restaurant can update this status');
      }
    }

    if (newStatus === 'picked_up' || newStatus === 'delivered') {
      if (role !== 'courier' && role !== 'admin') {
        throw new ForbiddenException('Only courier can update this status');
      }
    }

    if (newStatus === 'cancelled') {
      order.cancelReason = cancelReason || 'No reason provided';
    }

    order.status = newStatus;
    return this.orderRepo.save(order);
  }

  async assignCourier(orderId: string, courierId: string, earning: number): Promise<Order> {
    await this.orderRepo.update(orderId, {
      courier: { id: courierId } as any,
      status: 'courier_assigned',
      courierEarning: earning,
    });
    return this.findById(orderId);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({ order: { createdAt: 'DESC' } });
  }

  async getStats(): Promise<any> {
    const total = await this.orderRepo.count();
    const delivered = await this.orderRepo.count({ where: { status: 'delivered' } });
    const pending = await this.orderRepo.count({ where: { status: 'pending' } });
    const cancelled = await this.orderRepo.count({ where: { status: 'cancelled' } });
    return { total, delivered, pending, cancelled };
  }
}
