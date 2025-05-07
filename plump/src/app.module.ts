import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { TaskModule } from './task/task.module';
import { TaskDatesModule } from './task-dates/task-dates.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ProjectsModule, TaskModule, TaskDatesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}