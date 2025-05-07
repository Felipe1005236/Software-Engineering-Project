import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { UserManagementModule } from './user-management/user-management.module';
import { HealthStatusModule } from './health-status/health-status.module';
import { TimeTrackingModule } from './time-tracking/time-tracking.module';
import { TaskModule } from './task/task.module';
import { TaskDatesModule } from './task-dates/task-dates.module';
import { PrismaModule } from './prisma/prisma.module';
import { BudgetModule } from './budget/budget.module';

@Module({
  imports: [
    PrismaModule,
    BudgetModule,
    ProjectsModule,
    UserManagementModule,
    HealthStatusModule,
    TimeTrackingModule,
    TaskModule,
    TaskDatesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}