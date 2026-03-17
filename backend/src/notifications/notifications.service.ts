import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    const host = this.configService.get('SMTP_HOST', '');
    const user = this.configService.get('SMTP_USER', '');
    const pass = this.configService.get('SMTP_PASS', '');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.configService.get<number>('SMTP_PORT', 587),
        secure: false,
        auth: { user, pass },
      });
    }
  }

  async sendOrderNotificationEmail(order: {
    id: string;
    restaurantName: string;
    customerName: string;
    totalAmount: number;
    items: { name: string; quantity: number }[];
    deliveryAddress: string;
  }) {
    const adminEmail = this.configService.get('ADMIN_NOTIFY_EMAIL', 'kurtoqluo8@gmail.com');
    const itemsHtml = order.items.map(i => `<li>${i.quantity}x ${i.name}</li>`).join('');
    const subject = `🛎️ Yeni Sipariş #${order.id.substring(0, 8)} - ${order.restaurantName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #e8231a; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h2 style="margin: 0;">🛎️ Yeni Sipariş!</h2>
        </div>
        <div style="background: #fff; padding: 20px; border: 1px solid #eee; border-radius: 0 0 10px 10px;">
          <p><strong>Sipariş No:</strong> #${order.id.substring(0, 8)}</p>
          <p><strong>Restoran:</strong> ${order.restaurantName}</p>
          <p><strong>Müşteri:</strong> ${order.customerName}</p>
          <p><strong>Adres:</strong> ${order.deliveryAddress}</p>
          <p><strong>Ürünler:</strong></p>
          <ul>${itemsHtml}</ul>
          <p style="font-size: 18px; color: #e8231a;"><strong>Toplam: ₺${order.totalAmount.toFixed(2)}</strong></p>
          <a href="http://localhost:3000/admin/orders" 
             style="display: inline-block; background: #e8231a; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 10px;">
            Siparişi Görüntüle
          </a>
        </div>
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"Siparim Platform" <${this.configService.get('SMTP_USER')}>`,
          to: adminEmail,
          subject,
          html,
        });
        this.logger.log(`Order notification email sent to ${adminEmail}`);
      } catch (err) {
        this.logger.warn(`Failed to send email: ${(err as Error).message}`);
      }
    } else {
      this.logger.warn('Email not configured (SMTP_HOST/USER/PASS missing). Order notification skipped.');
      this.logger.log(`[NEW ORDER] ${subject} | Total: ₺${order.totalAmount}`);
    }
  }

  logWhatsAppLink(order: {
    id: string;
    restaurantName: string;
    customerName: string;
    totalAmount: number;
    deliveryAddress: string;
  }) {
    const phone = this.configService.get('ADMIN_NOTIFY_PHONE', '905458966096');
    const msg = encodeURIComponent(
      `🛎️ *Yeni Sipariş!*\n` +
      `📋 Sipariş No: #${order.id.substring(0, 8)}\n` +
      `🏪 Restoran: ${order.restaurantName}\n` +
      `👤 Müşteri: ${order.customerName}\n` +
      `📍 Adres: ${order.deliveryAddress}\n` +
      `💰 Toplam: ₺${order.totalAmount.toFixed(2)}\n\n` +
      `Siparim Admin: http://localhost:3000/admin/orders`
    );
    const link = `https://wa.me/${phone}?text=${msg}`;
    this.logger.log(`[WhatsApp Notification] ${link}`);
  }
}
