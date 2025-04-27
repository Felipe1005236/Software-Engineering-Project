import { IsString, IsNumber } from 'class-validator';
import { Status, Phase } from '@prisma/client';  

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  status: Status;

  @IsString()
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
