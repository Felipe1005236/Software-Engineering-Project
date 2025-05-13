import { IsOptional, IsString } from 'class-validator';

export class UpdateStakeholderDto {
  @IsOptional()
  @IsString()
  name?: string;
} 