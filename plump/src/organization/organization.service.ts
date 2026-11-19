import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UserManagementService } from '../user-management/user-management.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrganizationService {
  constructor(
    private prisma: PrismaService,
    private userService: UserManagementService
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto, userData?: any, unitData?: any) {
    try {
      // First create the organization
      const organization = await this.prisma.organization.create({
        data: createOrganizationDto,
        include: {
          units: true
        }
      });

      if (userData) {
        let unitId: number | undefined;

        // Create unit if unit data is provided
        if (unitData) {
          const unit = await this.prisma.unit.create({
            data: {
              name: unitData.name,
              description: unitData.description,
              organizationID: organization.organizationID
            }
          });
          unitId = unit.unitID;
        }

        // Create user with ADMIN role
        const user = await this.userService.create({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          password: userData.password, // Pass the plain password, it will be hashed in the user service
          primaryRole: 'ADMIN',
          active: true,
          unitID: unitId // This will be undefined if no unit was created
        });

        return {
          organization,
          unit: unitId ? await this.prisma.unit.findUnique({ where: { unitID: unitId } }) : undefined,
          user: { ...user, password: undefined } // Remove password from response
        };
      }

      return { organization };
    } catch (error) {
      console.error('Error creating organization:', error);
      throw new InternalServerErrorException('Failed to create organization: ' + error.message);
    }
  }

  findAll() {
    return this.prisma.organization.findMany({
      include: {
        units: true
      }
    });
  }

  findOne(id: number) {
    return this.prisma.organization.findUnique({
      where: { organizationID: id },
      include: {
        units: true
      }
    });
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: { organizationID: id },
      data: updateOrganizationDto
    });
  }

  remove(id: number) {
    return this.prisma.organization.delete({
      where: { organizationID: id }
    });
  }
} 