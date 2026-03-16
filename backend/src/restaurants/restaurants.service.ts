import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { User } from '../users/user.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant) private restaurantRepo: Repository<Restaurant>,
  ) {}

  async create(dto: CreateRestaurantDto, owner: Partial<User>): Promise<Restaurant> {
    const restaurant = this.restaurantRepo.create({ ...dto, owner, status: 'pending' });
    return this.restaurantRepo.save(restaurant);
  }

  async findAll(approved = true): Promise<Restaurant[]> {
    if (approved) {
      return this.restaurantRepo.find({ where: { status: 'approved' } });
    }
    return this.restaurantRepo.find();
  }

  async findById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({
      where: { id },
      relations: ['menuItems'],
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async findByOwner(ownerId: string): Promise<Restaurant[]> {
    return this.restaurantRepo.find({ where: { owner: { id: ownerId } } });
  }

  async update(id: string, dto: UpdateRestaurantDto, userId: string, role: string): Promise<Restaurant> {
    const restaurant = await this.findById(id);
    if (role !== 'admin' && restaurant.owner.id !== userId) {
      throw new ForbiddenException('Not your restaurant');
    }
    Object.assign(restaurant, dto);
    return this.restaurantRepo.save(restaurant);
  }

  async approve(id: string): Promise<Restaurant> {
    const restaurant = await this.findById(id);
    restaurant.status = 'approved';
    return this.restaurantRepo.save(restaurant);
  }

  async reject(id: string): Promise<Restaurant> {
    const restaurant = await this.findById(id);
    restaurant.status = 'rejected';
    return this.restaurantRepo.save(restaurant);
  }

  async suspend(id: string): Promise<Restaurant> {
    const restaurant = await this.findById(id);
    restaurant.status = 'suspended';
    return this.restaurantRepo.save(restaurant);
  }

  async toggleOpen(id: string, userId: string): Promise<Restaurant> {
    const restaurant = await this.findById(id);
    if (restaurant.owner.id !== userId) throw new ForbiddenException('Not your restaurant');
    restaurant.isOpen = !restaurant.isOpen;
    return this.restaurantRepo.save(restaurant);
  }

  async findByCategory(category: string): Promise<Restaurant[]> {
    return this.restaurantRepo.find({ where: { category, status: 'approved' } });
  }

  async delete(id: string, userId: string, role: string): Promise<void> {
    const restaurant = await this.findById(id);
    if (role !== 'admin' && restaurant.owner.id !== userId) {
      throw new ForbiddenException('Not your restaurant');
    }
    await this.restaurantRepo.remove(restaurant);
  }
}
