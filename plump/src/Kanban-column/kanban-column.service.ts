import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKanbanColumnDto } from './dto/create-kanban-column.dto';

@Injectable()
export class KanbanColumnService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateKanbanColumnDto) {
    return this.prisma.kanbanColumn.create({
      data: {
        name: dto.name,
        projectID: dto.projectID,
      },
    });
  }

  async findAll() {
    return this.prisma.kanbanColumn.findMany({
      include: {
        tasks: true,
      },
    });
  }
}
