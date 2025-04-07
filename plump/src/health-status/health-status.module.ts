import { Module } from '@nestjs/common';
import { HealthStatusController } from './health-status.controller';
import { HealthStatusService } from './health-status.service';

@Module({
  controllers: [HealthStatusController],
  providers: [HealthStatusService],
})
export class HealthStatusModule {}