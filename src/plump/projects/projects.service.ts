import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProjectDto } from './create-project.dto';
import { UpdateProjectDto } from './update-project.dto';
import { Project } from './projects.entity';

@Injectable()
export class ProjectsService {
  private projects: Project[] = [];

  // Get all projects
  getAllProjects(): Project[] {
    return this.projects;
  }

  // Get a project by ID
  getProjectById(id: number): Project {
    const project = this.projects.find((p) => p.projectId === id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  // Create a new project
  createProject(createProjectDto: CreateProjectDto): Project {
    if (!createProjectDto.title || !createProjectDto.projectLead) {
      throw new BadRequestException('Title and Project Lead are required');
    }

    const newProject: Project = {
      projectId: Date.now(),
      tasks: [],
      ...createProjectDto,
    };
    this.projects.push(newProject);
    return newProject;
  }

  // Update an existing project by ID
  updateProject(id: number, updateProjectDto: UpdateProjectDto): Project {
    const projectIndex = this.projects.findIndex((p) => p.projectId === id);
    if (projectIndex === -1) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const updatedProject = {
      ...this.projects[projectIndex],
      ...updateProjectDto,
    };
    this.projects[projectIndex] = updatedProject;
    return updatedProject;
  }

  // Delete a project by ID
  deleteProject(id: number): Project {
    const projectIndex = this.projects.findIndex((p) => p.projectId === id);
    if (projectIndex === -1) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const deletedProject = this.projects[projectIndex];
    this.projects.splice(projectIndex, 1);
    return deletedProject;
  }

  // Get all tasks for a specific project
  getTasksForProject(id: number): any[] {
    const project = this.getProjectById(id);
    return project.tasks || [];
  }
}
