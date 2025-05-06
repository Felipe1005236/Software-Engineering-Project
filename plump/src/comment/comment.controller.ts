import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  createComment(@Body() dto: CreateCommentDto) {
    return this.commentService.createComment(dto);
  }

  @Get('/project/:id')
  getComments(@Param('id') id: string) {
    return this.commentService.getCommentsByProject(Number(id));
  }
}
