import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskDatesService {
  constructor(private prisma: PrismaService) {}

  async create(startDate: string, targetDate: string) {
    // First create the task dates record
    const taskDates = await this.prisma.taskDates.create({
      data: {
        startDate: new Date(startDate),
        targetDate: new Date(targetDate),
        taskID: 0, // Temporary ID, will be updated when task is created
      }
    });

    return taskDates;
  }
} 