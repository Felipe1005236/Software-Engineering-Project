import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateHealthStatusDto {
  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsString()
  cost?: string;

  @IsOptional()
  @IsString()
  resource?: string;

  @IsOptional()
  @IsString()
  overall?: string;
}