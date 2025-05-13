import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  create(createUnitDto: CreateUnitDto) {
    return this.prisma.unit.create({
      data: createUnitDto
    });
  }

  findAll() {
    return this.prisma.unit.findMany({
      include: {
        organization: true,
        users: true
      }
    });
  }

  findOne(id: number) {
    return this.prisma.unit.findUnique({
      where: { unitID: id },
      include: {
        organization: true,
        users: true
      }
    });
  }

  findByOrganization(organizationId: number) {
    return this.prisma.unit.findMany({
      where: { organizationID: organizationId },
      include: {
        users: true
      }
    });
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return this.prisma.unit.update({
      where: { unitID: id },
      data: updateUnitDto
    });
  }

  remove(id: number) {
    return this.prisma.unit.delete({
      where: { unitID: id }
    });
  }

  async findTeamsByUnit(unitId: number) {
    // Get all users in the unit
    const users = await this.prisma.user.findMany({
      where: { unitID: unitId },
      select: { userID: true }
    });
    const userIds = users.map(u => u.userID);

    // Get all team memberships for those users
    const memberships = await this.prisma.teamMembership.findMany({
      where: { userID: { in: userIds } },
      include: { team: true }
    });

    // Get unique teams
    const teamsMap = new Map();
    memberships.forEach(m => {
      if (m.team) teamsMap.set(m.team.teamID, m.team);
    });
    return Array.from(teamsMap.values());
  }
} 