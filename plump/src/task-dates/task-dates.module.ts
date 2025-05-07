import { Module } from '@nestjs/common';
import { TaskDatesController } from './task-dates.controller';
import { TaskDatesService } from './task-dates.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TaskDatesController],
  providers: [TaskDatesService, PrismaService],
})
export class TaskDatesModule {} 