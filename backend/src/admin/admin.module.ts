import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SettingsService } from './settings.service';
import { PublicSettingsController } from './public-settings.controller';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { CouriersModule } from '../couriers/couriers.module';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [RestaurantsModule, CouriersModule, UsersModule, OrdersModule],
  controllers: [AdminController, PublicSettingsController],
  providers: [AdminService, SettingsService],
})
export class AdminModule {}
