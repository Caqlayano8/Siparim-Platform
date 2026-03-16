import {
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id/deactivate')
  deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }

  @Get('restaurants')
  getAllRestaurants() {
    return this.adminService.getAllRestaurants();
  }

  @Get('restaurants/pending')
  getPendingRestaurants() {
    return this.adminService.getPendingRestaurants();
  }

  @Put('restaurants/:id/approve')
  approveRestaurant(@Param('id') id: string) {
    return this.adminService.approveRestaurant(id);
  }

  @Put('restaurants/:id/reject')
  rejectRestaurant(@Param('id') id: string) {
    return this.adminService.rejectRestaurant(id);
  }

  @Put('restaurants/:id/suspend')
  suspendRestaurant(@Param('id') id: string) {
    return this.adminService.suspendRestaurant(id);
  }

  @Get('couriers')
  getAllCouriers() {
    return this.adminService.getAllCouriers();
  }

  @Get('couriers/pending')
  getPendingCouriers() {
    return this.adminService.getPendingCouriers();
  }

  @Put('couriers/:id/approve')
  approveCourier(@Param('id') id: string) {
    return this.adminService.approveCourier(id);
  }

  @Put('couriers/:id/reject')
  rejectCourier(@Param('id') id: string) {
    return this.adminService.rejectCourier(id);
  }

  @Put('couriers/:id/suspend')
  suspendCourier(@Param('id') id: string) {
    return this.adminService.suspendCourier(id);
  }
}
