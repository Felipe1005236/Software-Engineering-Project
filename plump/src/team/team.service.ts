import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.team.findMany();
  }
} 