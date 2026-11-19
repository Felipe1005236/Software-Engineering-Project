import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGanttDto } from './dto/create-gantt.dto';

@Injectable()
export class GanttService {
  constructor(private prisma: PrismaService) {}

  async setGanttDates(projectId: number, dto: CreateGanttDto) {
    // Validate date sequence
    if (new Date(dto.startDate) > new Date(dto.endDate)) {
      throw new Error('Start date cannot be after end date');
    }

    return this.prisma.project.update({
      where: { projectID: projectId },
      data: {
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        dependencies: dto.dependencies,
      },
    });
  }

  async getGanttData(projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: { projectID: projectId },
      include: {
        tasks: {
          include: {
            dates: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Fallback dates handling
    const projectStartDate = project.startDate || new Date();
    const projectEndDate = project.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default +30 days

    const tasks = project.tasks.map(task => {
      // Handle task dates with fallbacks
      let startDate = task.dates?.startDate;
      let endDate = task.dates?.targetDate;

      if (!startDate) {
        // If no task start date, use project start date + some offset
        startDate = new Date(projectStartDate);
        startDate.setDate(startDate.getDate() + (task.taskID % 7)); // Example offset
      }

      if (!endDate) {
        // If no task end date, use start date + duration
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 5); // Default 5-day duration
      }

      return {
        id: task.taskID,
        name: task.title,
        start: startDate,
        end: endDate,
        progress: task.percentageComplete || 0,
        dependencies: task.dependencies ? JSON.parse(task.dependencies) : [],
        assignee: task.user ? `${task.user.firstName} ${task.user.lastName}` : 'Unassigned',
      };
    });

    return {
      project: {
        id: project.projectID,
        name: project.title,
        start: projectStartDate,
        end: projectEndDate,
      },
      tasks,
    };
  }
}