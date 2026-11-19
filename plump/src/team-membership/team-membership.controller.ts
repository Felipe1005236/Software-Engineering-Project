import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { TeamMembershipService } from './team-membership.service';
import { CreateTeamMembershipDto } from './dto/create-team-membership.dto';
import { TeamRole, AccessLevel } from '@prisma/client';

@Controller('team-memberships')
export class TeamMembershipController {
  constructor(private readonly teamMembershipService: TeamMembershipService) {}

  @Post()
  create(@Body() createTeamMembershipDto: CreateTeamMembershipDto) {
    return this.teamMembershipService.create(createTeamMembershipDto);
  }

  @Get()
  findAll() {
    return this.teamMembershipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamMembershipService.findOne(+id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.teamMembershipService.findByUser(+userId);
  }

  @Get('team/:teamId')
  findByTeam(@Param('teamId') teamId: string) {
    return this.teamMembershipService.findByTeam(+teamId);
  }

  @Get('team/:teamId/org/:orgId')
  findByTeamAndOrg(@Param('teamId') teamId: string, @Param('orgId') orgId: string) {
    return this.teamMembershipService.findByTeamAndOrganization(+teamId, +orgId);
  }

  @Get('check-access/:userId/:projectId/:requiredAccess')
  checkAccess(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Param('requiredAccess') requiredAccess: AccessLevel
  ) {
    return this.teamMembershipService.checkProjectAccess(+userId, +projectId, requiredAccess);
  }

  @Put(':userId/:teamId')
  update(
    @Param('userId') userId: string,
    @Param('teamId') teamId: string,
    @Body('teamRole') teamRole: TeamRole,
    @Body('accessLevel') accessLevel: AccessLevel
  ) {
    return this.teamMembershipService.updateMembership(+userId, +teamId, teamRole, accessLevel);
  }

  @Delete(':userId/:teamId')
  remove(@Param('userId') userId: string, @Param('teamId') teamId: string) {
    return this.teamMembershipService.remove(+userId, +teamId);
  }
} 