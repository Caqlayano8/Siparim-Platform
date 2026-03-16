import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('my')
  myPayments(@Request() req) {
    return this.paymentsService.findByUser(req.user.id);
  }

  @Get('order/:orderId')
  orderPayments(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrder(orderId);
  }

  @Post(':paymentId/refund')
  @UseGuards(RolesGuard)
  @Roles('admin')
  refund(@Param('paymentId') paymentId: string) {
    return this.paymentsService.refund(paymentId);
  }
}
