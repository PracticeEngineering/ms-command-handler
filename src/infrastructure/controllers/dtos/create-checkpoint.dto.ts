import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

export enum ShipmentStatus {
  CREATED = 'CREATED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  AT_FACILITY = 'AT_FACILITY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  EXCEPTION = 'EXCEPTION',
}

export class CreateCheckpointDto {
  @IsString()
  @IsNotEmpty()
  trackingId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ShipmentStatus)
  @IsIn(Object.values(ShipmentStatus))
  status: string;

  @IsString()
  @IsOptional()
  location?: string;
}