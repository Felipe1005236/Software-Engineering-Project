import { Controller, Get, UseGuards } from '@nestjs/common';
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
} 