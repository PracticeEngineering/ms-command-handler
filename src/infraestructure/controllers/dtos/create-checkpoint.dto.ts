import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCheckpointDto {
  @IsString()
  @IsNotEmpty()
  trackingId: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  location?: string;
}