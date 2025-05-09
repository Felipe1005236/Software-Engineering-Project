import { Module } from '@nestjs/common';
import { TeamMembershipController } from './team-membership.controller';
import { TeamMembershipService } from './team-membership.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeamMembershipController],
  providers: [TeamMembershipService],
  exports: [TeamMembershipService]
})
export class TeamMembershipModule {} 