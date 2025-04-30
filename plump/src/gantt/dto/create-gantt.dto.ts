import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateGanttDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  dependencies?: string; 
}