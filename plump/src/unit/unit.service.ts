import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  async create(createUnitDto: CreateUnitDto) {
    try {
      console.log('Creating unit with data:', createUnitDto);
      
      // Validate required fields
      if (!createUnitDto.name) {
        throw new Error('Unit name is required');
      }
      if (!createUnitDto.organizationID) {
        throw new Error('Organization ID is required');
      }
      if (!createUnitDto.managerID) {
        throw new Error('Manager ID is required');
      }

      // Check if organization exists
      const organization = await this.prisma.organization.findUnique({
        where: { organizationID: createUnitDto.organizationID }
      });
      if (!organization) {
        throw new Error('Organization not found');
      }

      // Check if manager exists
      const manager = await this.prisma.user.findUnique({
        where: { userID: createUnitDto.managerID }
      });
      if (!manager) {
        throw new Error('Manager not found');
      }

      // Check if user is already a manager of another unit
      const existingManagedUnit = await this.prisma.unit.findUnique({
        where: { managerID: createUnitDto.managerID }
      });
      if (existingManagedUnit) {
        throw new Error('User is already a manager of another unit');
      }

      const unit = await this.prisma.unit.create({
        data: {
          name: createUnitDto.name,
          description: createUnitDto.description,
          organizationID: createUnitDto.organizationID,
          managerID: createUnitDto.managerID
        },
        include: {
          organization: true,
          users: true,
          manager: true
        }
      });
      console.log('Unit created successfully:', unit);
      return unit;
    } catch (error) {
      console.error('Error creating unit:', error);
      throw new InternalServerErrorException(`Failed to create unit: ${error.message}`);
    }
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