export class UpdateHealthStatusDto {
    status?: 'healthy' | 'warning' | 'critical';
    metrics?: {
      uptime?: number;
      responseTime?: number;
      errorRate?: number;
    };
  }