import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma, Status } from '@prisma/client'; 

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // Create a new project
  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        title: createProjectDto.title,
        status: createProjectDto.status,
        phase: createProjectDto.phase,
        teamID: createProjectDto.teamId,
        health: { connect: { healthID: createProjectDto.healthId } },
        budget: { connect: { budgetID: createProjectDto.budgetId } },
        dates: { connect: { dateID: createProjectDto.dateId } },
      },
    });
  }

  // Get all projects
  async findAll() {
    return this.prisma.project.findMany();
  }

  // Get one project by ID
  async findOne(projectID: number) {
    return this.prisma.project.findUnique({
      where: { projectID },
    });
  }

  // Update a project by ID
  async update(projectID: number, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { projectID },
      data: updateProjectDto,
    });
  }

  // Delete a project by ID
  async remove(projectID: number) {
    return this.prisma.project.delete({
      where: { projectID },
    });
  }
  

  async searchProjects(filters: {
    title?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.project.findMany({
      where: {
        ...(filters.title && {
          title: {
            contains: filters.title,
          },
        }),
        ...(filters.status && {
          status: {
            equals: filters.status as any,
          },
        }),
        ...(filters.startDate && filters.endDate && {
          dates: { // 🔥 inside the related ProjectDates model
            startDate: {
              gte: filters.startDate,
              lte: filters.endDate,
            },
          },
        }),
      },
      include: {
        dates: true, // 🔥 Optional: to return date info too
      },
    });
  }
}  