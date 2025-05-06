import { Module } from '@nestjs/common';
import { BudgetModule } from './budget/budget.module';
import { PrismaService } from './prisma/prisma.service';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [BudgetModule, CommentModule],
  providers: [PrismaService],
})
export class AppModule {}
