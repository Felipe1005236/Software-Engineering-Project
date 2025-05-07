import { Module } from '@nestjs/common';
import { KanbanColumnService } from './kanban-column.service';
import { KanbanColumnController } from './kanban-column.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [KanbanColumnController],
  providers: [KanbanColumnService, PrismaService],
})
export class KanbanColumnModule {}
