import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { OrderItem } from './order-item.entity';
import { Courier } from '../couriers/courier.entity';

export type OrderStatus =
  | 'pending'
  | 'restaurant_accepted'
  | 'preparing'
  | 'ready'
  | 'courier_assigned'
  | 'picked_up'
  | 'delivered'
  | 'cancelled';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  customer: User;

  @ManyToOne(() => Restaurant, { eager: true })
  restaurant: Restaurant;

  @ManyToOne(() => Courier, { nullable: true, eager: true })
  courier: Courier;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @Column({
    type: 'enum',
    enum: ['pending', 'restaurant_accepted', 'preparing', 'ready', 'courier_assigned', 'picked_up', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ nullable: true })
  deliveryAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  deliveryLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  deliveryLongitude: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  cancelReason: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  courierEarning: number;

  @Column({ nullable: true })
  estimatedDeliveryTime: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
