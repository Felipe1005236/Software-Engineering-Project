import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Status } from '@prisma/client';

export class SearchProjectsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
