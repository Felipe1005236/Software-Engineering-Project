import { Module } from '@nestjs/common';
import { UserManagementModule } from './user-management/user-management.module';
import { HealthStatusModule } from './health-status/health-status.module';

@Module({

  imports: [UserManagementModule, HealthStatusModule]
})
export class AppModule {}

