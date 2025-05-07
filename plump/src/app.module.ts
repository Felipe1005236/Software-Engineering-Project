import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { TaskModule } from './task/task.module';
import { TaskDatesModule } from './task-dates/task-dates.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ProjectsModule, TaskModule, TaskDatesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}