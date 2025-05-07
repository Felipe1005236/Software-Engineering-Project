import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from './task.interface';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAll(projectID?: number) {
    return this.prisma.task.findMany({
      where: projectID ? { projectID } : undefined,
      orderBy: { taskID: 'desc' }
    });
  }

  async getOne(id: number) {
    return this.prisma.task.findUnique({
      where: { taskID: id }
    });
  }

  async create(title: string, description: string, projectID: number) {
    return this.prisma.task.create({
      data: {
        title,
        details: description,
        projectID,
        status: 'TODO',
        percentageComplete: 0,
        priority: 'MEDIUM',
        userID: 1, // TODO: Get from authenticated user
        dateID: 1  // TODO: Create TaskDates record
      }
    });
  }

  async update(id: number, updates: Partial<Task>) {
    return this.prisma.task.update({
      where: { taskID: id },
      data: updates
    });
  }

  async delete(id: number) {
    return this.prisma.task.delete({
      where: { taskID: id }
    });
  }
}
