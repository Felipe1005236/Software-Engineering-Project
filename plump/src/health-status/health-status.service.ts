import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHealthStatusDto } from './dto/create-health-status.dto';
import { UpdateHealthStatusDto } from './dto/update-health-status.dto';

@Injectable()
export class HealthStatusService {
  constructor(private prisma: PrismaService) {}

  async create(createHealthStatusDto: CreateHealthStatusDto) {
    return this.prisma.healthStatus.create({
      data: createHealthStatusDto,
    });
  }

  async findAll() {
    return this.prisma.healthStatus.findMany();
  }

  async findOne(id: number) {
    return this.prisma.healthStatus.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateHealthStatusDto: UpdateHealthStatusDto) {
    return this.prisma.healthStatus.update({
      where: { id },
      data: updateHealthStatusDto,
    });
  }

  async remove(id: number) {
    return this.prisma.healthStatus.delete({
      where: { id },
    });
  }
}