import { Module } from '@nestjs/common';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';

@Module({
  controllers: [UserManagementController],
  providers: [UserManagementService],
})
export class UserManagementModule {}