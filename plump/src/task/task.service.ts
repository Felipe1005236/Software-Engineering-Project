import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAll(projectID?: number) {
    return this.prisma.task.findMany({
      where: projectID ? { projectID } : undefined,
      orderBy: { taskID: 'desc' },
      include: {
        user: true
      }
    });
  }

  async getOne(id: number) {
    return this.prisma.task.findUnique({
      where: { taskID: id },
      include: {
        user: true
      }
    });
  }

  async create(
    title: string,
    details: string,
    projectID: number,
    userID: number,
    status: string,
    percentageComplete: number,
    priority: string,
    startDate: string,
    targetDate: string
  ) {
    try {
      const task = await this.prisma.task.create({
        data: {
          title,
          details,
          projectID,
          userID,
          status,
          percentageComplete,
          priority,
          startDate: new Date(startDate),
          targetDate: new Date(targetDate)
        },
        include: {
          user: true
        }
      });

      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id: number, updates: any) {
    return this.prisma.task.update({
      where: { taskID: id },
      data: {
        ...updates,
        startDate: updates.startDate ? new Date(updates.startDate) : undefined,
        targetDate: updates.targetDate ? new Date(updates.targetDate) : undefined,
        actualCompletion: updates.actualCompletion ? new Date(updates.actualCompletion) : undefined
      },
      include: {
        user: true
      }
    });
  }

  async delete(id: number) {
    return this.prisma.task.delete({
      where: { taskID: id }
    });
  }
}
