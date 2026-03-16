import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Address } from './address.entity';
import { Exclude } from 'class-transformer';

export type UserRole = 'customer' | 'restaurant_owner' | 'courier' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: ['customer', 'restaurant_owner', 'courier', 'admin'],
    default: 'customer',
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
