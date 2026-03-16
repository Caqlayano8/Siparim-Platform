import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Order } from '../orders/order.entity';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);
  private userSocketMap = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET', 'siparim_secret'),
      });
      client.data.userId = payload.sub;
      client.data.role = payload.role;
      this.userSocketMap.set(payload.sub, client.id);
      client.join(`user:${payload.sub}`);
      client.join(`role:${payload.role}`);
      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch (err) {
      this.logger.warn(`Unauthorized connection attempt: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      this.userSocketMap.delete(client.data.userId);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('courier:location')
  handleCourierLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { latitude: number; longitude: number; orderId?: string },
  ) {
    if (client.data.role !== 'courier') return;
    this.server.to('role:admin').emit('courier:location_update', {
      courierId: client.data.userId,
      ...data,
    });
    if (data.orderId) {
      this.server.emit(`order:${data.orderId}:courier_location`, {
        latitude: data.latitude,
        longitude: data.longitude,
      });
    }
  }

  @SubscribeMessage('order:subscribe')
  handleOrderSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    client.join(`order:${data.orderId}`);
  }

  notifyOrderStatusChange(order: Order): void {
    const payload = {
      orderId: order.id,
      status: order.status,
      updatedAt: order.updatedAt,
    };
    this.server.to(`order:${order.id}`).emit('order:status_changed', payload);
    if (order.customer) {
      this.server.to(`user:${order.customer.id}`).emit('order:status_changed', payload);
    }
    if (order.courier) {
      this.server.to(`user:${order.courier.user?.id}`).emit('order:status_changed', payload);
    }
    this.server.to('role:admin').emit('order:status_changed', payload);
  }

  notifyRestaurant(ownerId: string, event: string, data: any): void {
    this.server.to(`user:${ownerId}`).emit(`restaurant:${event}`, data);
  }

  offerOrderToCourier(userId: string, data: any): void {
    this.server.to(`user:${userId}`).emit('courier:order_offer', data);
  }

  notifyNewOrder(restaurantOwnerId: string, order: any): void {
    this.server.to(`user:${restaurantOwnerId}`).emit('restaurant:new_order', order);
  }
}
