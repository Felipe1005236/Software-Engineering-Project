import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Status, Phase } from '@prisma/client'; 

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
}
