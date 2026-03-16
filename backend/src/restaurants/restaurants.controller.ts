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
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) return this.restaurantsService.findByCategory(category);
    return this.restaurantsService.findAll(true);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant_owner', 'admin')
  create(@Body() dto: CreateRestaurantDto, @Request() req) {
    return this.restaurantsService.create(dto, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant_owner', 'admin')
  update(@Param('id') id: string, @Body() dto: UpdateRestaurantDto, @Request() req) {
    return this.restaurantsService.update(id, dto, req.user.id, req.user.role);
  }

  @Put(':id/toggle-open')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant_owner')
  toggleOpen(@Param('id') id: string, @Request() req) {
    return this.restaurantsService.toggleOpen(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant_owner', 'admin')
  delete(@Param('id') id: string, @Request() req) {
    return this.restaurantsService.delete(id, req.user.id, req.user.role);
  }

  @Get('owner/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('restaurant_owner')
  findMyRestaurants(@Request() req) {
    return this.restaurantsService.findByOwner(req.user.id);
  }
}
