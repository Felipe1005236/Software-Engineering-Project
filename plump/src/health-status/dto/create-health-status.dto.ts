import { IsString, IsInt } from 'class-validator';

export class CreateHealthStatusDto {
  @IsInt()
  projectId: number;

  @IsString()
  scope: string;

  @IsString()
  schedule: string;

  @IsString()
  cost: string;

  @IsString()
  resource: string;

  @IsString()
  overall: string;
}