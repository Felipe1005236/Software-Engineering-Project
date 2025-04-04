import { Injectable, NotFoundException } from '@nestjs/common';

type Budget = {
  BudgetID: number;        // Primary Key
  TotalBudget: number;
  ProjectID: number;       
  ActualCost: number;
  ForecastCost: number;
};

@Injectable()
export class BudgetsService {
  private budgets: Budget[] = [];
  private nextId = 1;

  getAll(): Budget[] {
    return this.budgets;
  }

  create(data: Omit<Budget, 'BudgetID'>): Budget {
    const newBudget: Budget = { BudgetID: this.nextId++, ...data };
    this.budgets.push(newBudget);
    return newBudget;
  }
  
  getById(id: number): Budget {
    const budget = this.budgets.find(b => b.BudgetID === id);
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    return budget;
  }
  
  update(id: number, data: Partial<Omit<Budget, 'BudgetID'>>): Budget {
    const index = this.budgets.findIndex(b => b.BudgetID === id);
    if (index === -1) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    this.budgets[index] = { ...this.budgets[index], ...data };
    return this.budgets[index];
  }
  
  delete(id: number): Budget {
    const index = this.budgets.findIndex(b => b.BudgetID === id);
    if (index === -1) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    return this.budgets.splice(index, 1)[0];
  }
}