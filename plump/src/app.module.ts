import { Module } from '@nestjs/common';
import { BudgetModule } from './budget/budget.module';
import { PrismaService } from './prisma/prisma.service';
import { ProjectsModule } from './projects/projects.module';
import { UserManagementModule } from './user-management/user-management.module';
import { HealthStatusModule } from './health-status/health-status.module';
import { GanttModule } from './gantt/gantt.module';

@Module({
  imports: [BudgetModule, ProjectsModule, UserManagementModule, HealthStatusModule, GanttModule],
  providers: [PrismaService]

})
export class AppModule {}