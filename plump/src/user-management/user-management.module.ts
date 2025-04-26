import { Module } from '@nestjs/common';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserManagementController, PrismaService],
  providers: [UserManagementService],
})
export class UserManagementModule {}