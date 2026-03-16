import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentMethod } from './payment.entity';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    private configService: ConfigService,
  ) {}

  async initiatePayment(
    order: Order,
    user: User,
    method: PaymentMethod,
    cardData?: {
      cardHolderName: string;
      cardNumber: string;
      expireMonth: string;
      expireYear: string;
      cvc: string;
    },
  ): Promise<Payment> {
    const existing = await this.paymentRepo.findOne({
      where: { order: { id: order.id }, status: 'completed' },
    });
    if (existing) throw new BadRequestException('Payment already completed');

    const payment = this.paymentRepo.create({
      order,
      user,
      amount: order.totalAmount,
      method,
      status: 'pending',
    });

    if (method === 'cash_on_delivery') {
      payment.status = 'completed';
      payment.iyzicoPaymentId = `CASH_${Date.now()}`;
    } else if (method === 'credit_card' || method === 'online') {
      try {
        const result = await this.processIyzicoPayment(order, user, cardData);
        payment.iyzicoPaymentId = result.paymentId;
        payment.iyzicoToken = result.token;
        payment.status = result.success ? 'completed' : 'failed';
        if (!result.success) payment.failureReason = result.errorMessage;
      } catch (err) {
        payment.status = 'failed';
        payment.failureReason = err.message;
        this.logger.error(`Payment failed for order ${order.id}: ${err.message}`);
      }
    }

    return this.paymentRepo.save(payment);
  }

  private async processIyzicoPayment(
    order: Order,
    user: User,
    cardData?: any,
  ): Promise<{ success: boolean; paymentId: string; token: string; errorMessage?: string }> {
    const apiKey = this.configService.get('IYZICO_API_KEY');
    const secretKey = this.configService.get('IYZICO_SECRET_KEY');

    this.logger.log(`Processing Iyzico payment for order ${order.id}`);
    this.logger.log(`Iyzico API Key: ${apiKey ? 'configured' : 'NOT configured'}`);

    // Iyzico integration placeholder
    // In production, integrate with Iyzico SDK:
    // const Iyzipay = require('iyzipay');
    // const iyzipay = new Iyzipay({ apiKey, secretKey, uri: 'https://api.iyzipay.com' });
    // Then call iyzipay.payment.create({ ... }) with proper request body

    const simulateSuccess = Math.random() > 0.1;
    if (simulateSuccess) {
      return {
        success: true,
        paymentId: `IYZICO_${Date.now()}`,
        token: `TOKEN_${Math.random().toString(36).substr(2, 9)}`,
      };
    } else {
      return {
        success: false,
        paymentId: '',
        token: '',
        errorMessage: 'Card declined',
      };
    }
  }

  async refund(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'completed') throw new BadRequestException('Payment is not completed');
    // In production: call Iyzico refund API
    payment.status = 'refunded';
    return this.paymentRepo.save(payment);
  }

  async findByOrder(orderId: string): Promise<Payment[]> {
    return this.paymentRepo.find({ where: { order: { id: orderId } } });
  }

  async findByUser(userId: string): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
