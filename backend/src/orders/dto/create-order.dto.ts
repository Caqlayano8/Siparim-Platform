import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  menuItemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  selectedOptions?: Record<string, any>[];
}

export class CreateOrderDto {
  @IsString()
  restaurantId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  deliveryAddress: string;

  @IsNumber()
  deliveryLatitude: number;

  @IsNumber()
  deliveryLongitude: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
