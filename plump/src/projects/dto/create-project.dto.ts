import { IsString, IsNumber, IsEnum } from 'class-validator';
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

  @IsNumber()
  healthId: number;

  @IsNumber()
  budgetId: number;

  @IsNumber()
  dateId: number;
}
