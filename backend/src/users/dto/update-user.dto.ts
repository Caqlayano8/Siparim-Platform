import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateAddressDto {
  @IsString()
  title: string;

  @IsString()
  fullAddress: string;

  @IsString()
  district: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
