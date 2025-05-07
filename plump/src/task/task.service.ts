import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from './task.interface';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAll(projectID?: number) {
    return this.prisma.task.findMany({
      where: projectID ? { projectID } : undefined,
      orderBy: { taskID: 'desc' },
      include: {
        dates: true,
        user: true
      }
    });
  }

  async getOne(id: number) {
    return this.prisma.task.findUnique({
      where: { taskID: id },
      include: {
        dates: true,
        user: true
      }
    });
  }

  async create(
    title: string,
    details: string,
    projectID: number,
    dateID: number,
    userID: number,
    status: string,
    percentageComplete: number,
    priority: string
  ) {
    try {
      // Create the task
      const task = await this.prisma.task.create({
        data: {
          title,
          details,
          projectID,
          dateID,
          userID,
          status,
          percentageComplete,
          priority
        },
        include: {
          dates: true,
          user: true
        }
      });

      // Update the task dates with the correct taskID
      await this.prisma.taskDates.update({
        where: { dateID: dateID },
        data: { taskID: task.taskID }
      });

      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id: number, updates: Partial<Task>) {
    return this.prisma.task.update({
      where: { taskID: id },
      data: updates,
      include: {
        dates: true,
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
