import { Module } from '@nestjs/common';
import { BudgetModule } from './budget/budget.module';
import { PrismaService } from './prisma/prisma.service';
import { CommentModule } from './comment/comment.module';
import { KanbanColumnModule } from './Kanban-column/kanban-column.module';

@Module({
  imports: [BudgetModule, CommentModule, KanbanColumnModule],
  providers: [PrismaService],
})
export class AppModule {}
