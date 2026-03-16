import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Restaurant, (r) => r.menuItems, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: 0 })
  preparationTime: number;

  @Column({ type: 'jsonb', nullable: true })
  options: Record<string, any>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
