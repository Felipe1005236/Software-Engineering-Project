import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CommentController } from './comments/comment.controller';
import { CommentService } from './comments/comment.service';

@Module({
  controllers: [TaskController, CommentController],
  providers: [TaskService, CommentService],
})
export class TaskModule {}
