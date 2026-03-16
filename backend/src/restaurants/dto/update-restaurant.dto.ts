import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsNumber()
  minimumOrderAmount?: number;

  @IsOptional()
  @IsNumber()
  deliveryFee?: number;

  @IsOptional()
  @IsNumber()
  estimatedDeliveryTime?: number;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;
}
