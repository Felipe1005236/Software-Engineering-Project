import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateUnitDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  manager?: string;

  @IsNumber()
  @IsOptional()
  organizationID?: number;
} 