import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CouriersService } from './couriers.service';
import { CourierAssignmentService } from './courier-assignment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('couriers')
@UseGuards(JwtAuthGuard)
export class CouriersController {
  constructor(
    private readonly couriersService: CouriersService,
    private readonly assignmentService: CourierAssignmentService,
  ) {}

  @Post('register')
  @UseGuards(RolesGuard)
  @Roles('courier')
  registerCourier(
    @Body() body: { vehicleType: string; vehiclePlate?: string; identityNumber?: string },
    @Request() req,
  ) {
    return this.couriersService.register(req.user, body.vehicleType, body.vehiclePlate, body.identityNumber);
  }

  @Get('me')
  @UseGuards(RolesGuard)
  @Roles('courier')
  getProfile(@Request() req) {
    return this.couriersService.findByUser(req.user.id);
  }

  @Put('me/location')
  @UseGuards(RolesGuard)
  @Roles('courier')
  updateLocation(@Request() req, @Body() dto: UpdateLocationDto) {
    return this.couriersService.updateLocation(req.user.id, dto);
  }

  @Put('me/toggle-online')
  @UseGuards(RolesGuard)
  @Roles('courier')
  toggleOnline(@Request() req) {
    return this.couriersService.toggleOnline(req.user.id);
  }

  @Post('order-response')
  @UseGuards(RolesGuard)
  @Roles('courier')
  respondToOrder(
    @Body() body: { orderId: string; accepted: boolean },
    @Request() req,
  ) {
    return this.assignmentService.handleCourierResponse(body.orderId, req.user.id, body.accepted);
  }
}
