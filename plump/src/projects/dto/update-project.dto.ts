import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Status, Phase, HealthColours } from '@prisma/client'; 

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status; // ✅ Correct validation for enums

  @IsEnum(Phase)
  @IsOptional()
  phase?: Phase; // ✅ Correct validation for enums

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

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  targetDate?: string;

  @IsOptional()
  health?: {
    scope?: HealthColours;
    schedule?: HealthColours;
    cost?: HealthColours;
    resource?: HealthColours;
    overall?: HealthColours;
  };
}
