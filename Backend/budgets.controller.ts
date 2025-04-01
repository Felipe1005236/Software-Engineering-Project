import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { BudgetsService } from './budgets.service';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  getAll() {
    return this.budgetsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.budgetsService.getById(Number(id));
  }

  @Post()
  create(@Body() body: any) {
    return this.budgetsService.create(body);
  }

  @Patch(':BudgetID')
update(@Param('BudgetID') id: string, @Body() body: any) {
  return this.budgetsService.update(Number(id), body);
}


  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.budgetsService.delete(Number(id));
  }
}
