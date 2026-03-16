import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem) private menuRepo: Repository<MenuItem>,
    private restaurantsService: RestaurantsService,
  ) {}

  async create(restaurantId: string, dto: CreateMenuItemDto, userId: string): Promise<MenuItem> {
    const restaurant = await this.restaurantsService.findById(restaurantId);
    if (restaurant.owner.id !== userId) throw new ForbiddenException('Not your restaurant');
    const item = this.menuRepo.create({ ...dto, restaurant });
    return this.menuRepo.save(item);
  }

  async findByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return this.menuRepo.find({
      where: { restaurant: { id: restaurantId } },
    });
  }

  async findById(id: string): Promise<MenuItem> {
    const item = await this.menuRepo.findOne({ where: { id }, relations: ['restaurant'] });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async update(id: string, dto: Partial<CreateMenuItemDto>, userId: string, role: string): Promise<MenuItem> {
    const item = await this.findById(id);
    if (role !== 'admin' && item.restaurant.owner.id !== userId) {
      throw new ForbiddenException('Not your restaurant');
    }
    Object.assign(item, dto);
    return this.menuRepo.save(item);
  }

  async toggleAvailability(id: string, userId: string): Promise<MenuItem> {
    const item = await this.findById(id);
    if (item.restaurant.owner.id !== userId) throw new ForbiddenException('Not your restaurant');
    item.isAvailable = !item.isAvailable;
    return this.menuRepo.save(item);
  }

  async delete(id: string, userId: string, role: string): Promise<void> {
    const item = await this.findById(id);
    if (role !== 'admin' && item.restaurant.owner.id !== userId) {
      throw new ForbiddenException('Not your restaurant');
    }
    await this.menuRepo.remove(item);
  }

  async findByCategory(restaurantId: string, category: string): Promise<MenuItem[]> {
    return this.menuRepo.find({
      where: { restaurant: { id: restaurantId }, category },
    });
  }
}
