import { Body, Controller, Delete, Get, Param, ParseIntPipe,Res, Patch, Post, Query, UseGuards, Request } from '@nestjs/common'; 
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SearchProjectsDto } from './dto/search-projects.dto'; 
import { Response } from 'express';
import { ProjectAccessGuard, RequiredAccess } from '../common/guards/project-access.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TeamMembershipService } from '../team-membership/team-membership.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly teamMembershipService: TeamMembershipService
  ) {}

  @Get('dashboard')
  async getDashboardStats() {
    const projects = await this.projectsService.findAll();
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const plannedProjects = projects.filter(p => p.status === 'PROPOSED').length;

    return {
      stats: [
        { title: 'Total Projects', value: totalProjects, icon: 'projects' },
        { title: 'Active', value: activeProjects, icon: 'active' },
        { title: 'Completed', value: completedProjects, icon: 'completed' },
        { title: 'Planned', value: plannedProjects, icon: 'planned' },
      ],
      activity: [
        { emoji: '✅', text: 'Project "Apollo" completed', time: '2h ago' },
        { emoji: '⚠️', text: 'Project "Zeus" status updated', time: '4h ago' },
        { emoji: '🗓️', text: 'New project "Atlas" created', time: 'Yesterday' },
        { emoji: '💬', text: 'Comment on "Hercules" project', time: '2 days ago' },
      ],
      team: [
        { name: 'Alice', status: 'Online', tasks: 5 },
        { name: 'Javier', status: 'Idle', tasks: 2 },
        { name: 'Kavya', status: 'Offline', tasks: 7 },
      ],
    };
  }

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    try {
      const project = await this.projectsService.create(createProjectDto);
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      return { error: error.message || 'Unknown error' };
    }
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.userID;
    const userRole = req.user.role;

    // If user is admin, return all projects
    if (userRole === 'ADMIN') {
      return this.projectsService.findAll();
    }

    // For non-admin users, filter by team membership
    const teamMemberships = await this.teamMembershipService.findByUser(userId);
    const teamIds = teamMemberships.map(membership => membership.teamID);
    
    return this.projectsService.findAll({
      teamID: {
        in: teamIds
      }
    });
  }

  @Get('search')
  searchProjects(
    @Query('title') title?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.projectsService.searchProjects({
      title,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('export')
  async exportProjectData(@Res() res: Response) {
    return this.projectsService.exportProjectData(res);
  }

  @Get(':id')
  @UseGuards(ProjectAccessGuard)
  @RequiredAccess('READ_ONLY')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }
  
  @Patch(':id')
  @UseGuards(ProjectAccessGuard)
  @RequiredAccess('READ_WRITE')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(ProjectAccessGuard)
  @RequiredAccess('FULL_ACCESS')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }

  @Get(':id/access-level')
  async getProjectAccessLevel(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    const userId = req.user.userID;
    const userRole = req.user.role;

    // Admin users have full access
    if (userRole === 'ADMIN') {
      return { accessLevel: 'FULL_ACCESS' };
    }

    // Check team membership access
    const accessCheck = await this.teamMembershipService.checkProjectAccess(
      userId,
      id,
      'FULL_ACCESS'
    );

    if (accessCheck.hasAccess) {
      return { accessLevel: 'FULL_ACCESS' };
    }

    // Check for read-write access
    const readWriteCheck = await this.teamMembershipService.checkProjectAccess(
      userId,
      id,
      'READ_WRITE'
    );

    if (readWriteCheck.hasAccess) {
      return { accessLevel: 'READ_WRITE' };
    }

    // Check for read-only access
    const readOnlyCheck = await this.teamMembershipService.checkProjectAccess(
      userId,
      id,
      'READ_ONLY'
    );

    if (readOnlyCheck.hasAccess) {
      return { accessLevel: 'READ_ONLY' };
    }

    // No access
    return { accessLevel: 'NO_ACCESS' };
  }
}
