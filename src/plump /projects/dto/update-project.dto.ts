import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Status, Phase } from '@prisma/client'; 

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  status?: Status; 

  @IsString()
  @IsOptional()
  phase?: Phase; 

  @IsNumber()
  @IsOptional()
  teamId?: number;

  @IsNumber()
  @IsOptional()
  healthId?: number;

  @IsNumber()
  @IsOptional()
  budgetId?: number;

  @IsNumber()
  @IsOptional()
  dateId?: number;
}
