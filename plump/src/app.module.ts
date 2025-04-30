import { Module } from '@nestjs/common';
import { BudgetModule } from './budget/budget.module';
import { PrismaService } from './prisma/prisma.service';
import { ProjectsModule } from './projects/projects.module';
import { UserManagementModule } from './user-management/user-management.module';
import { HealthStatusModule } from './health-status/health-status.module';
import { TimeTrackingModule } from './time-tracking/time-tracking.module';

@Module({
  imports: [BudgetModule, ProjectsModule, UserManagementModule, HealthStatusModule, TimeTrackingModule],
  providers: [PrismaService]

})
export class AppModule {}