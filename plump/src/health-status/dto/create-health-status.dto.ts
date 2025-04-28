import { IsString, IsInt } from 'class-validator';
import {HealthColours} from '@prisma/client';

export class CreateHealthStatusDto {
  @IsInt()
  projectId: number;

  @IsString()
  scope: HealthColours;

  @IsString()
  schedule: HealthColours;

  @IsString()
  cost: HealthColours;

  @IsString()
  resource: HealthColours;

  @IsString()
  overall: HealthColours;
}