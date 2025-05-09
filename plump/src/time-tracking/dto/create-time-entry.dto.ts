import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateTimeEntryDto {
  @IsNotEmpty()
  userID: number;

  @IsNotEmpty()
  projectID: number;

  @IsDateString()
  dateWorked: string;

  @IsNumber()
  hoursSpent: number;

  @IsOptional()
  @IsIn(['overwrite', 'accumulate'])
  mode?: 'overwrite' | 'accumulate';
}