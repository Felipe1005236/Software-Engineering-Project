import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CommentController } from './comments/comment.controller';
import { CommentService } from './comments/comment.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskController, CommentController],
  providers: [TaskService, CommentService],
})
export class TaskModule {}
