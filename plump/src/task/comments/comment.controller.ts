import {
    Controller, Post, Get, Param, UploadedFiles, UseInterceptors, Body, ParseIntPipe
  } from '@nestjs/common';
  import { CommentService } from './comment.service';
  import { CreateCommentDto } from './dto/create-comment.dto';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { Multer } from 'multer';

  
  @Controller('tasks/:taskId/comments')
  export class CommentController {
    constructor(private readonly commentService: CommentService) {}
  
    @Get()
    getComments(@Param('taskId', ParseIntPipe) taskId: number) {
      return this.commentService.getCommentsForTask(taskId);
    }
  
    @Post()
    @UseInterceptors(FilesInterceptor('attachments', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }))
    async createComment(
      @Param('taskId', ParseIntPipe) taskId: number,
      @Body() body: CreateCommentDto,
      @UploadedFiles() files: Multer.File[],
    ) {
      return this.commentService.createComment(taskId, body, files);
    }
  }
  