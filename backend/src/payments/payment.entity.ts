import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'cash_on_delivery' | 'online';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, { eager: true })
  order: Order;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: ['credit_card', 'cash_on_delivery', 'online'],
    default: 'credit_card',
  })
  method: PaymentMethod;

  @Column({ nullable: true })
  iyzicoPaymentId: string;

  @Column({ nullable: true })
  iyzicoToken: string;

  @Column({ nullable: true })
  failureReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
