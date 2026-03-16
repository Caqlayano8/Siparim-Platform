import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { MenuItem } from '../menu/menu-item.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => MenuItem, { eager: true })
  menuItem: MenuItem;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  selectedOptions: Record<string, any>[];
}
