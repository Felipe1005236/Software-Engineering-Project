import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status, Prisma } from '@prisma/client';

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
    status: Status,
    percentageComplete: number,
    priority: string,
    startDate: string,
    targetDate: string
  ) {
    try {
      // Use a transaction to ensure data consistency
      return await this.prisma.$transaction(async (prisma) => {
        const taskData: Prisma.TaskCreateInput = {
      title,
          details,
          status,
          percentageComplete,
          priority,
          startDate: new Date(startDate),
          targetDate: new Date(targetDate),
          project: {
            connect: { projectID }
          },
          user: {
            connect: { userID }
          }
        };

        const task = await prisma.task.create({
          data: taskData,
          include: {
            user: true
          }
        });

        // Verify the task was created
        const createdTask = await prisma.task.findUnique({
          where: { taskID: task.taskID },
          include: {
            user: true
          }
        });

        if (!createdTask) {
          throw new Error('Task was not created successfully');
        }

        return createdTask;
      });
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
