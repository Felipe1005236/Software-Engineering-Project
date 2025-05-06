import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        text: dto.text,
        user: { connect: { userID: dto.userId } },
        project: { connect: { projectID: dto.projectId } },
      },
    });
  }

  async getCommentsByProject(projectId: number) {
    return this.prisma.comment.findMany({
      where: { projectID: projectId },
      include: {
        user: true, // returns user info with comment
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
