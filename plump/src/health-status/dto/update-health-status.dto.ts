import { IsString, IsInt, IsOptional } from 'class-validator';
import { HealthColours } from '@prisma/client';

export class UpdateHealthStatusDto {
  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsString()
  scope?: HealthColours;

  @IsOptional()
  @IsString()
  schedule?: HealthColours;

  @IsOptional()
  @IsString()
  cost?: HealthColours;

  @IsOptional()
  @IsString()
  resource?: HealthColours;

  @IsOptional()
  @IsString()
  overall?: HealthColours;
}