import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path if needed

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async genericSearch(searchTerm?: string) {
    try {
      const projectWhere = searchTerm
        ? { title: { contains: searchTerm } }  // Removed `mode: 'insensitive'`
        : {};

      const taskWhere = searchTerm
        ? { title: { contains: searchTerm } }
        : {};

      const userWhere = searchTerm
        ? {
            OR: [
              { firstName: { contains: searchTerm } },
              { lastName: { contains: searchTerm } },
              { email: { contains: searchTerm } },
            ],
          }
        : {};

      const [projects, tasks, users] = await Promise.all([
        this.prisma.project.findMany({ where: projectWhere }),
        this.prisma.task.findMany({ where: taskWhere }),
        this.prisma.user.findMany({ where: userWhere }),
      ]);

      return {
        projects,
        tasks,
        users,
      };

    } catch (error) {
      console.error('❌ Error in genericSearch:', error.message);
      throw error; // Re-throw so NestJS error handler can catch and respond
    }
  }
}
