import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserManagementModule } from '../user-management/user-management.module';

@Module({
  imports: [PrismaModule, UserManagementModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService]
})
export class OrganizationModule {} 