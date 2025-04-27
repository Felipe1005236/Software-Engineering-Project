import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService

@Module({
  controllers: [ProjectsController], // Add the controller
  providers: [ProjectsService, PrismaService], // Provide the services and PrismaService
})
export class ProjectsModule {}
