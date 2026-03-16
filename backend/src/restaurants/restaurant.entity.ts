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
import { MenuItem } from '../menu/menu-item.entity';

export type RestaurantStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  owner: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  minimumOrderAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ default: 30 })
  estimatedDeliveryTime: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  })
  status: RestaurantStatus;

  @Column({ default: false })
  isOpen: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @OneToMany(() => MenuItem, (item) => item.restaurant)
  menuItems: MenuItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
