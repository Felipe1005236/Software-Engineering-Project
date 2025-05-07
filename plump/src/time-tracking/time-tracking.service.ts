import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TimeTrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async createTimeEntry(data: Prisma.TimeTrackingCreateInput) {
    return this.prisma.timeTracking.create({
      data,
      include: {
        user: true,
        project: true,
        task: true,
      },
    });
  }

  async getAllEntries() {
    return this.prisma.timeTracking.findMany({
      include: {
        user: true,
        project: true,
        task: true,
      },
      orderBy: {
        dateWorked: 'desc', // Changed from workedDate to dateWorked
      },
    });
  }
}