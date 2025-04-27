import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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
}
