import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { UserManagementModule } from './user-management/user-management.module';
import { HealthStatusModule } from './health-status/health-status.module';
import { TimeTrackingModule } from './time-tracking/time-tracking.module';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { BudgetModule } from './budget/budget.module';
import { CalendarEventModule } from './calendar-event/calendar-event.module';
import { SearchController } from './searchBar_testing/search.controller';
import { SearchService } from './searchBar_testing/search.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { OrganizationModule } from './organization/organization.module';
import { UnitModule } from './unit/unit.module';
import { TeamMembershipModule } from './team-membership/team-membership.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    BudgetModule,
    ProjectsModule,
    UserManagementModule,
    HealthStatusModule,
    TimeTrackingModule,
    TaskModule,
    CalendarEventModule,
    OrganizationModule,
    UnitModule,
    TeamMembershipModule,
    AuthModule,
  ],
  controllers: [AppController, SearchController, DashboardController],
  providers: [AppService, SearchService],
})
export class AppModule {}