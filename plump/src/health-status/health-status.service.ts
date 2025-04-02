import { Injectable } from '@nestjs/common';
import { HealthStatus } from './interfaces/health-status.interface';
import { CreateHealthStatusDto } from './dto/create-health-status.dto';
import { UpdateHealthStatusDto } from './dto/update-health-status.dto';

@Injectable()
export class HealthStatusService {
  private healthStatuses: HealthStatus[] = [];

  create(createHealthStatusDto: CreateHealthStatusDto): HealthStatus {
    const newStatus: HealthStatus = {
      id: Date.now().toString(),
      lastChecked: new Date(),
      ...createHealthStatusDto,
      metrics: {
        uptime: createHealthStatusDto.metrics.uptime ?? 100,
        responseTime: createHealthStatusDto.metrics.responseTime ?? 0,
        errorRate: createHealthStatusDto.metrics.errorRate ?? 0,
      }
    };
    this.healthStatuses.push(newStatus);
    return newStatus;
  }

  findAll(): HealthStatus[] {
    return this.healthStatuses;
  }

  findOne(id: string): HealthStatus | null {
    return this.healthStatuses.find(status => status.id === id) || null;
  }

  update(id: string, updateHealthStatusDto: UpdateHealthStatusDto): HealthStatus | null {
    const index = this.healthStatuses.findIndex(status => status.id === id);
    if (index === -1) return null;

    const current = this.healthStatuses[index];
    this.healthStatuses[index] = {
      ...current,
      ...updateHealthStatusDto,
      metrics: {
        uptime: updateHealthStatusDto.metrics?.uptime ?? current.metrics.uptime,
        responseTime: updateHealthStatusDto.metrics?.responseTime ?? current.metrics.responseTime,
        errorRate: updateHealthStatusDto.metrics?.errorRate ?? current.metrics.errorRate,
      },
      lastChecked: new Date(),
    };
    return this.healthStatuses[index];
  }

  remove(id: string): { deleted: boolean } {
    const initialLength = this.healthStatuses.length;
    this.healthStatuses = this.healthStatuses.filter(status => status.id !== id);
    return { deleted: this.healthStatuses.length < initialLength };
  }
}