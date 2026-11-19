import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateStakeholderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  projectID: number;
} 