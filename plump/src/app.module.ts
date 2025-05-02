import { Module } from '@nestjs/common';
import { BudgetModule } from './budget/budget.module';
import { PrismaService } from './prisma/prisma.service';
import { ProjectsModule } from './projects/projects.module';
import { UserManagementModule } from './user-management/user-management.module';
import { HealthStatusModule } from './health-status/health-status.module';
import { SearchController } from './searchBar_testing/search.controller';
import { SearchService } from './searchBar_testing/search.service';
import { DashboardController } from './dashboard/dashboard.controller';

@Module({
  imports: [BudgetModule, ProjectsModule, UserManagementModule, HealthStatusModule],
  controllers: [SearchController], 
  providers: [PrismaService, SearchService, DashboardController ]

})
export class AppModule {}