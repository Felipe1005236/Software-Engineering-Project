import { IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Status, Phase } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsEnum(Status)
  status: Status;

  @IsEnum(Phase)
  phase: Phase;

  @IsNumber()
  teamId: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsNumber()
  healthId?: number;

  @IsNumber()
  budgetId?: number;

  @IsNumber()
  dateId?: number;
}
