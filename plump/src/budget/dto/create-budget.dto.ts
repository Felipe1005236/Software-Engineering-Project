import { IsNumber } from 'class-validator';

export class CreateBudgetDto {
  @IsNumber()
  totalBudget: number;

  @IsNumber()
  actualCost: number;

  @IsNumber()
  forecastCost: number;

  @IsNumber()
  projectID: number;
}
