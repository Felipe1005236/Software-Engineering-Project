import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TeamRole, AccessLevel } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.team.findMany();
  }

  async create(name: string, unitId: number, creatorId: number) {
    // Create the team and team membership in a transaction
    return this.prisma.$transaction(async (prisma) => {
      // Create the team
      const team = await prisma.team.create({
        data: {
          name,
        }
      });

      // Create team membership for the creator
      await prisma.teamMembership.create({
        data: {
          userID: creatorId,
          teamID: team.teamID,
          teamRole: TeamRole.TEAM_LEAD,
          accessLevel: AccessLevel.FULL_ACCESS
        }
      });

      return team;
    });
  }
} 