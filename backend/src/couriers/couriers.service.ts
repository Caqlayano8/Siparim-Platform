import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Courier } from './courier.entity';
import { UpdateLocationDto } from './dto/update-location.dto';
import { User } from '../users/user.entity';

@Injectable()
export class CouriersService {
  constructor(
    @InjectRepository(Courier) private courierRepo: Repository<Courier>,
  ) {}

  async register(user: Partial<User>, vehicleType: string, vehiclePlate?: string, identityNumber?: string): Promise<Courier> {
    const existing = await this.courierRepo.findOne({ where: { user: { id: user.id } } });
    if (existing) throw new BadRequestException('Courier profile already exists');
    const courier = this.courierRepo.create({
      user,
      vehicleType: vehicleType as any,
      vehiclePlate,
      identityNumber,
      status: 'pending',
    });
    return this.courierRepo.save(courier);
  }

  async findByUser(userId: string): Promise<Courier> {
    const courier = await this.courierRepo.findOne({ where: { user: { id: userId } } });
    if (!courier) throw new NotFoundException('Courier profile not found');
    return courier;
  }

  async findById(id: string): Promise<Courier> {
    const courier = await this.courierRepo.findOne({ where: { id } });
    if (!courier) throw new NotFoundException('Courier not found');
    return courier;
  }

  async findAll(): Promise<Courier[]> {
    return this.courierRepo.find();
  }

  async updateLocation(userId: string, dto: UpdateLocationDto): Promise<Courier> {
    const courier = await this.findByUser(userId);
    courier.currentLatitude = dto.latitude;
    courier.currentLongitude = dto.longitude;
    courier.lastLocationUpdate = new Date();
    return this.courierRepo.save(courier);
  }

  async toggleOnline(userId: string): Promise<Courier> {
    const courier = await this.findByUser(userId);
    if (courier.status !== 'approved') {
      throw new BadRequestException('Courier is not approved');
    }
    courier.isOnline = !courier.isOnline;
    return this.courierRepo.save(courier);
  }

  async findOnlineCouriersNear(lat: number, lon: number, radiusKm: number): Promise<Courier[]> {
    const couriers = await this.courierRepo.find({
      where: { isOnline: true, status: 'approved' },
    });
    return couriers
      .filter((c) => {
        if (!c.currentLatitude || !c.currentLongitude) return false;
        const dist = this.haversineDistance(lat, lon, Number(c.currentLatitude), Number(c.currentLongitude));
        return dist <= radiusKm;
      })
      .sort((a, b) => {
        const da = this.haversineDistance(lat, lon, Number(a.currentLatitude), Number(a.currentLongitude));
        const db = this.haversineDistance(lat, lon, Number(b.currentLatitude), Number(b.currentLongitude));
        return da - db;
      });
  }

  haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  async approve(id: string): Promise<Courier> {
    const courier = await this.findById(id);
    courier.status = 'approved';
    return this.courierRepo.save(courier);
  }

  async reject(id: string): Promise<Courier> {
    const courier = await this.findById(id);
    courier.status = 'rejected';
    return this.courierRepo.save(courier);
  }

  async suspend(id: string): Promise<Courier> {
    const courier = await this.findById(id);
    courier.status = 'suspended';
    return this.courierRepo.save(courier);
  }

  async addEarning(courierId: string, amount: number): Promise<void> {
    const courier = await this.findById(courierId);
    courier.totalEarnings = Number(courier.totalEarnings) + amount;
    courier.totalDeliveries += 1;
    await this.courierRepo.save(courier);
  }

  calculateEarning(distanceKm: number): number {
    if (distanceKm <= 2) return 25;
    if (distanceKm <= 5) return 35;
    return 45;
  }
}
