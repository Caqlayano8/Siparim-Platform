import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export type CourierStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type VehicleType = 'bicycle' | 'motorcycle' | 'car' | 'on_foot';

@Entity('couriers')
export class Courier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  })
  status: CourierStatus;

  @Column({
    type: 'enum',
    enum: ['bicycle', 'motorcycle', 'car', 'on_foot'],
    default: 'motorcycle',
  })
  vehicleType: VehicleType;

  @Column({ nullable: true })
  vehiclePlate: string;

  @Column({ nullable: true })
  identityNumber: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  currentLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  currentLongitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ default: 0 })
  totalDeliveries: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @Column({ nullable: true })
  lastLocationUpdate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
