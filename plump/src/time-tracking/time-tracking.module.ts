import { Module } from '@nestjs/common';
import { TimeTrackingService } from './time-tracking.service';
import { TimeTrackingController } from './time-tracking.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TimeTrackingController],
  providers: [TimeTrackingService, PrismaService],
})
export class TimeTrackingModule {}