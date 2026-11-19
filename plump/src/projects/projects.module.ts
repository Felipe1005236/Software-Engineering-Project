import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService
import { TeamMembershipModule } from '../team-membership/team-membership.module';

@Module({
  controllers: [ProjectsController], // Add the controller
  providers: [ProjectsService, PrismaService], // Provide the services and PrismaService
  imports: [TeamMembershipModule],
})
export class ProjectsModule {}
