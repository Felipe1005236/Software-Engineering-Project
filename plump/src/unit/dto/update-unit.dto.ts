import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateUnitDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  managerID?: number;

  @IsNumber()
  @IsOptional()
  organizationID?: number;
} 