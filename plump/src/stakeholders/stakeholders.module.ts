import { Module } from '@nestjs/common';
import { StakeholdersService } from './stakeholders.service';
import { StakeholdersController } from './stakeholders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TeamMembershipModule } from '../team-membership/team-membership.module';
import { StakeholderAccessGuard } from './stakeholder-access.guard';

@Module({
  imports: [PrismaModule, TeamMembershipModule],
  controllers: [StakeholdersController],
  providers: [StakeholdersService, StakeholderAccessGuard],
  exports: [StakeholdersService]
})
export class StakeholdersModule {} 