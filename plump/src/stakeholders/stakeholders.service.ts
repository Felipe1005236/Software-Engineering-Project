import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { UpdateStakeholderDto } from './dto/update-stakeholder.dto';

@Injectable()
export class StakeholdersService {
  private readonly logger = new Logger(StakeholdersService.name);
  
  constructor(private prisma: PrismaService) {}

  // Create a new stakeholder
  async create(createStakeholderDto: CreateStakeholderDto) {
    this.logger.log(`Creating stakeholder for project ${createStakeholderDto.projectID}`);
    
    // Check if the project exists
    const project = await this.prisma.project.findUnique({
      where: { projectID: createStakeholderDto.projectID },
    });

    if (!project) {
      this.logger.error(`Project with ID ${createStakeholderDto.projectID} not found`);
      throw new NotFoundException(`Project with ID ${createStakeholderDto.projectID} not found`);
    }

    this.logger.log(`Project found, creating stakeholder`);
    return this.prisma.stakeholder.create({
      data: createStakeholderDto,
    });
  }

  // Get all stakeholders for a project
  async findAllByProject(projectId: number) {
    this.logger.log(`Finding stakeholders for project ${projectId}`);
    
    // Check if the project exists
    const project = await this.prisma.project.findUnique({
      where: { projectID: projectId },
    });

    if (!project) {
      this.logger.error(`Project with ID ${projectId} not found`);
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    this.logger.log(`Project found, returning stakeholders`);
    return this.prisma.stakeholder.findMany({
      where: { projectID: projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a specific stakeholder by ID
  async findOne(id: number) {
    this.logger.log(`Finding stakeholder with ID ${id}`);
    
    const stakeholder = await this.prisma.stakeholder.findUnique({
      where: { stakeholderID: id },
    });

    if (!stakeholder) {
      this.logger.error(`Stakeholder with ID ${id} not found`);
      throw new NotFoundException(`Stakeholder with ID ${id} not found`);
    }

    return stakeholder;
  }

  // Update a stakeholder
  async update(id: number, updateStakeholderDto: UpdateStakeholderDto) {
    this.logger.log(`Updating stakeholder with ID ${id}`);
    
    // Check if the stakeholder exists
    const stakeholder = await this.prisma.stakeholder.findUnique({
      where: { stakeholderID: id },
    });

    if (!stakeholder) {
      this.logger.error(`Stakeholder with ID ${id} not found`);
      throw new NotFoundException(`Stakeholder with ID ${id} not found`);
    }

    this.logger.log(`Stakeholder found, updating`);
    return this.prisma.stakeholder.update({
      where: { stakeholderID: id },
      data: updateStakeholderDto,
    });
  }

  // Delete a stakeholder
  async remove(id: number) {
    this.logger.log(`Deleting stakeholder with ID ${id}`);
    
    // Check if the stakeholder exists
    const stakeholder = await this.prisma.stakeholder.findUnique({
      where: { stakeholderID: id },
    });

    if (!stakeholder) {
      this.logger.error(`Stakeholder with ID ${id} not found`);
      throw new NotFoundException(`Stakeholder with ID ${id} not found`);
    }

    this.logger.log(`Stakeholder found, deleting`);
    return this.prisma.stakeholder.delete({
      where: { stakeholderID: id },
    });
  }
} 