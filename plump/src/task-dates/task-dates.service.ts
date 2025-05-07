import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskDatesService {
  constructor(private prisma: PrismaService) {}

  async create(startDate: string, targetDate: string) {
    try {
      // Create task dates without requiring taskID initially
      const taskDates = await this.prisma.taskDates.create({
        data: {
          startDate: new Date(startDate),
          targetDate: new Date(targetDate),
          // taskID will be updated later when the task is created
          taskID: 0
        }
      });

      return taskDates;
    } catch (error) {
      console.error('Error creating task dates:', error);
      throw error;
    }
  }

  async updateTaskId(dateId: number, taskId: number) {
    try {
      return await this.prisma.taskDates.update({
        where: { dateID: dateId },
        data: { taskID: taskId }
      });
    } catch (error) {
      console.error('Error updating task dates:', error);
      throw error;
    }
  }
} 