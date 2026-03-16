import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('customer')
  createOrder(@Body() dto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(dto, req.user);
  }

  @Get('my')
  @UseGuards(RolesGuard)
  @Roles('customer')
  myOrders(@Request() req) {
    return this.ordersService.findByCustomer(req.user.id);
  }

  @Get('courier/my')
  @UseGuards(RolesGuard)
  @Roles('courier')
  courierOrders(@Request() req) {
    return this.ordersService.findByCourier(req.user.id);
  }

  @Get('restaurant/:restaurantId')
  @UseGuards(RolesGuard)
  @Roles('restaurant_owner', 'admin')
  restaurantOrders(@Param('restaurantId') restaurantId: string, @Request() req) {
    return this.ordersService.findByRestaurant(restaurantId, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus; cancelReason?: string },
    @Request() req,
  ) {
    return this.ordersService.updateStatus(id, body.status, req.user.id, req.user.role, body.cancelReason);
  }
}
