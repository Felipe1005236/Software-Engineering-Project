import { Module } from '@nestjs/common';
import { GanttController } from './gantt.controller';
import { GanttService } from './gantt.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GanttController],
  providers: [GanttService, PrismaService],
})
export class GanttModule {}