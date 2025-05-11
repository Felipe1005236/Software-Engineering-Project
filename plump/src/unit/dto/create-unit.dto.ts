import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  managerID?: number;

  @IsNumber()
  @IsNotEmpty()
  organizationID: number;
} 