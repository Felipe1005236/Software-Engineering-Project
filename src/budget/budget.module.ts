import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { PrismaService } from '../prisma/prisma.service';  

@Module({
  providers: [BudgetService, PrismaService],
  controllers: [BudgetController]
})
export class BudgetModule {}