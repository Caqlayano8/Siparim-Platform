import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

@Controller('restaurants/:restaurantId/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll(@Param('restaurantId') restaurantId: string, @Query('category') category?: string) {
    if (category) return this.menuService.findByCategory(restaurantId, category);
    return this.menuService.findByRestaurant(restaurantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant_owner', 'admin')
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateMenuItemDto,
    @Request() req,
  ) {
    return this.menuService.create(restaurantId, dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant_owner', 'admin')
  update(@Param('id') id: string, @Body() dto: CreateMenuItemDto, @Request() req) {
    return this.menuService.update(id, dto, req.user.id, req.user.role);
  }

  @Put(':id/toggle-availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant_owner')
  toggleAvailability(@Param('id') id: string, @Request() req) {
    return this.menuService.toggleAvailability(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant_owner', 'admin')
  delete(@Param('id') id: string, @Request() req) {
    return this.menuService.delete(id, req.user.id, req.user.role);
  }
}
