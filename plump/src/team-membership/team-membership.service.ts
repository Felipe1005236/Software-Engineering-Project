import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMembershipDto } from './dto/create-team-membership.dto';
import { TeamRole, AccessLevel } from '@prisma/client';

@Injectable()
export class TeamMembershipService {
  constructor(private prisma: PrismaService) {}

  create(createTeamMembershipDto: CreateTeamMembershipDto) {
    return this.prisma.teamMembership.create({
      data: createTeamMembershipDto
    });
  }

  findAll() {
    return this.prisma.teamMembership.findMany({
      include: {
        user: true,
        team: {
          include: {
            project: true
          }
        }
      }
    });
  }

  findOne(id: number) {
    return this.prisma.teamMembership.findUnique({
      where: { membershipID: id },
      include: {
        user: true,
        team: {
          include: {
            project: true
          }
        }
      }
    });
  }

  findByUser(userId: number) {
    return this.prisma.teamMembership.findMany({
      where: { userID: userId },
      include: {
        team: {
          include: {
            project: true
          }
        }
      }
    });
  }

  findByTeam(teamId: number) {
    return this.prisma.teamMembership.findMany({
      where: { teamID: teamId },
      include: {
        user: true
      }
    });
  }

  // Check if a user has access to a specific project
  async checkProjectAccess(userId: number, projectId: number, requiredAccess: AccessLevel = 'READ_ONLY') {
    // Find the project to get its team ID
    const project = await this.prisma.project.findUnique({
      where: { projectID: projectId },
      select: { teamID: true }
    });

    if (!project) {
      return { hasAccess: false, message: 'Project not found' };
    }

    // Get user's membership in this team
    const membership = await this.prisma.teamMembership.findUnique({
      where: {
        userID_teamID: {
          userID: userId,
          teamID: project.teamID
        }
      }
    });

    if (!membership) {
      return { hasAccess: false, message: 'User is not a member of this project team' };
    }

    // Check access level
    const accessLevels = {
      'READ_ONLY': 0,
      'READ_WRITE': 1,
      'FULL_ACCESS': 2
    };

    const userAccessLevel = accessLevels[membership.accessLevel];
    const requiredAccessLevel = accessLevels[requiredAccess];

    if (userAccessLevel >= requiredAccessLevel) {
      return { 
        hasAccess: true, 
        role: membership.teamRole,
        accessLevel: membership.accessLevel
      };
    } else {
      return { 
        hasAccess: false, 
        message: 'Insufficient access level',
        currentAccess: membership.accessLevel,
        requiredAccess
      };
    }
  }

  updateMembership(userId: number, teamId: number, teamRole: TeamRole, accessLevel: AccessLevel) {
    return this.prisma.teamMembership.update({
      where: {
        userID_teamID: {
          userID: userId,
          teamID: teamId
        }
      },
      data: {
        teamRole,
        accessLevel
      }
    });
  }

  remove(userId: number, teamId: number) {
    return this.prisma.teamMembership.delete({
      where: {
        userID_teamID: {
          userID: userId,
          teamID: teamId
        }
      }
    });
  }
} 