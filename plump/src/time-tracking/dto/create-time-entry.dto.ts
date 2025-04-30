import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTimeEntryDto {
  @IsNotEmpty()
  userID: number;

  @IsNotEmpty()
  projectID: number;

  @IsOptional()
  taskID?: number;

  @IsDateString()
  workedDate: string;

  @IsNumber()
  hoursWorked: number; 

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  role: string; 
}