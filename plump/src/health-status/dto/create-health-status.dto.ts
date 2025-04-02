export class CreateHealthStatusDto {
    projectId: string;
    status: 'healthy' | 'warning' | 'critical' = 'healthy';
    metrics: {
      uptime: number;
      responseTime: number;
      errorRate: number;
    };
  }