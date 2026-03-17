import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './user.entity';
import { Address } from './address.entity';
import { UpdateUserDto, CreateAddressDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['addresses'] });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByEmailOrUsername(identifier: string): Promise<User> {
    if (identifier.includes('@')) {
      return this.userRepo.findOne({ where: { email: ILike(identifier) } });
    }
    return this.userRepo.findOne({ where: { firstName: ILike(identifier) } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async updateProfile(id: string, dto: UpdateUserDto): Promise<User> {
    await this.userRepo.update(id, dto);
    return this.findById(id);
  }

  async changePassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) throw new BadRequestException('Old password is incorrect');
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(id, { password: hashed });
  }

  async addAddress(userId: string, dto: CreateAddressDto): Promise<Address> {
    const user = await this.findById(userId);
    if (dto.isDefault) {
      await this.addressRepo.update({ user: { id: userId } }, { isDefault: false });
    }
    const address = this.addressRepo.create({ ...dto, user });
    return this.addressRepo.save(address);
  }

  async getAddresses(userId: string): Promise<Address[]> {
    return this.addressRepo.find({ where: { user: { id: userId } } });
  }

  async updateAddress(userId: string, addressId: string, dto: Partial<CreateAddressDto>): Promise<Address> {
    const address = await this.addressRepo.findOne({ where: { id: addressId, user: { id: userId } } });
    if (!address) throw new NotFoundException('Address not found');
    if (dto.isDefault) {
      await this.addressRepo.update({ user: { id: userId } }, { isDefault: false });
    }
    Object.assign(address, dto);
    return this.addressRepo.save(address);
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const address = await this.addressRepo.findOne({ where: { id: addressId, user: { id: userId } } });
    if (!address) throw new NotFoundException('Address not found');
    await this.addressRepo.remove(address);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async deactivate(id: string): Promise<void> {
    await this.userRepo.update(id, { isActive: false });
  }
}
