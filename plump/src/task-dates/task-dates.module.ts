import { Module } from '@nestjs/common';
import { TaskDatesController } from './task-dates.controller';
import { TaskDatesService } from './task-dates.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskDatesController],
  providers: [TaskDatesService],
})
export class TaskDatesModule {} 