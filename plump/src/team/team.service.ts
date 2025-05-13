import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.team.findMany();
  }

  async create(name: string, unitId: number) {
    // Optionally, you can add more fields
    return this.prisma.team.create({
      data: {
        name,
        // Optionally, add a relation to unit if your schema supports it
        // unit: { connect: { unitID: unitId } }
      }
    });
  }
} 