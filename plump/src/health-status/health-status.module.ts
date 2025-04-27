import { Module } from '@nestjs/common';
import { HealthStatusController } from './health-status.controller';
import { HealthStatusService } from './health-status.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HealthStatusController],
  providers: [HealthStatusService, PrismaService],
})
export class HealthStatusModule {}