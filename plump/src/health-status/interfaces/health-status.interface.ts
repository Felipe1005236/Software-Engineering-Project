export interface HealthStatus {
    id: string;
    projectId: string;
    status: 'healthy' | 'warning' | 'critical';
    lastChecked: Date;
    metrics: {
      uptime: number;
      responseTime: number;
      errorRate: number;
    };
  }