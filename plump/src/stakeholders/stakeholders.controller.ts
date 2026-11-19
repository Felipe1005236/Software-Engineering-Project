import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  UseGuards,
  Request,
  Logger
} from '@nestjs/common';
import { StakeholdersService } from './stakeholders.service';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { UpdateStakeholderDto } from './dto/update-stakeholder.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StakeholderAccessGuard } from './stakeholder-access.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class StakeholdersController {
  private readonly logger = new Logger(StakeholdersController.name);

  constructor(private readonly stakeholdersService: StakeholdersService) {}

  // Create a new stakeholder
  @Post('projects/:projectId/stakeholders')
  @UseGuards(StakeholderAccessGuard)
  async create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createStakeholderDto: CreateStakeholderDto,
    @Request() req
  ) {
    this.logger.log(`Creating stakeholder for project ${projectId}, user: ${req.user?.userID}, role: ${req.user?.role}`);
    
    // Ensure the project ID in the path matches the DTO
    createStakeholderDto.projectID = projectId;
    return this.stakeholdersService.create(createStakeholderDto);
  }

  // Get all stakeholders for a project
  @Get('projects/:projectId/stakeholders')
  @UseGuards(StakeholderAccessGuard)
  findAll(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Request() req
  ) {
    this.logger.log(`Getting stakeholders for project ${projectId}, user: ${req.user?.userID}, role: ${req.user?.role}`);
    return this.stakeholdersService.findAllByProject(projectId);
  }

  // Get a specific stakeholder
  @Get('projects/:projectId/stakeholders/:id')
  @UseGuards(StakeholderAccessGuard)
  findOne(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    this.logger.log(`Getting stakeholder ${id} from project ${projectId}, user: ${req.user?.userID}, role: ${req.user?.role}`);
    return this.stakeholdersService.findOne(id);
  }

  // Update a stakeholder
  @Patch('projects/:projectId/stakeholders/:id')
  @UseGuards(StakeholderAccessGuard)
  update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStakeholderDto: UpdateStakeholderDto,
    @Request() req
  ) {
    this.logger.log(`Updating stakeholder ${id} for project ${projectId}, user: ${req.user?.userID}, role: ${req.user?.role}`);
    return this.stakeholdersService.update(id, updateStakeholderDto);
  }

  // Delete a stakeholder
  @Delete('projects/:projectId/stakeholders/:id')
  @UseGuards(StakeholderAccessGuard)
  remove(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    this.logger.log(`Deleting stakeholder ${id} from project ${projectId}, user: ${req.user?.userID}, role: ${req.user?.role}`);
    return this.stakeholdersService.remove(id);
  }
} 