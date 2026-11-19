import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';
import { File } from 'multer';


const prisma = new PrismaClient();

@Injectable()
export class CommentService {
  async getCommentsForTask(taskId: number) {
    return prisma.comment.findMany({
      where: { taskId },
      include: { attachments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createComment(taskId: number, dto: CreateCommentDto, files: File[]) {
    const attachmentsData = files?.map(file => ({
      fileUrl: `/uploads/${file.filename}`,
    })) || [];

    return prisma.comment.create({
      data: {
        content: dto.content,
        taskId,
        attachments: {
          create: attachmentsData,
        },
      },
      include: { attachments: true },
    });
  }
}
