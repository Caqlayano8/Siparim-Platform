import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouriersService } from './couriers.service';
import { CouriersController } from './couriers.controller';
import { CourierAssignmentService } from './courier-assignment.service';
import { Courier } from './courier.entity';
import { OrdersModule } from '../orders/orders.module';
import { AppGatewayModule } from '../gateway/app.gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Courier]),
    forwardRef(() => OrdersModule),
    AppGatewayModule,
  ],
  controllers: [CouriersController],
  providers: [CouriersService, CourierAssignmentService],
  exports: [CouriersService, CourierAssignmentService],
})
export class CouriersModule {}
