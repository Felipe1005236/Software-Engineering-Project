import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarEventService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.calendarEvent.findMany();
  }

  create(data: any) {
    return this.prisma.calendarEvent.create({ data });
  }

  remove({ id }: { id: number }) {
    return this.prisma.calendarEvent.delete({ where: { id } });
  }
} 