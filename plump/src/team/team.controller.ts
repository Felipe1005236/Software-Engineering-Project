import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Post()
  async create(@Body() body: { name: string, unitId: number }, @Request() req) {
    return this.teamService.create(body.name, body.unitId, req.user.userID);
  }
} 