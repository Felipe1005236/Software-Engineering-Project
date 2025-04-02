import { Module } from '@nestjs/common';
import { UserManagementModule } from './user-management/user-management.module';

@Module({

  imports: [UserManagementModule]
})
export class AppModule {}

