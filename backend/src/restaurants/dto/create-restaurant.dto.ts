import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

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
  @Min(0)
  minimumOrderAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  deliveryFee?: number;

  @IsOptional()
  @IsNumber()
  estimatedDeliveryTime?: number;
}
