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
} 