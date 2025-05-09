import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  manager: string;

  @IsNumber()
  @IsNotEmpty()
  organizationID: number;
} 