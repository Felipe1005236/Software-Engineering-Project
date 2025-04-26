import { Module } from '@nestjs/common';
import { BudgetModule } from './budget/budget.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  
  imports: [BudgetModule],

  providers: [PrismaService]

})
export class AppModule {}

