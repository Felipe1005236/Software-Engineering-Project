import { Module } from '@nestjs/common';
import { BudgetModule } from './budget/budget.module';
import { PrismaService } from './prisma/prisma.service';
import { ProjectsModule } from './projects/projects.module';  

@Module({
  imports: [BudgetModule, ProjectsModule],
  providers: [PrismaService]
})
export class AppModule {}
