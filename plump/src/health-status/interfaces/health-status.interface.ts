import { Project } from '@prisma/client';

export interface HealthStatus {
  id: number;
  projectId: number;
  scope: string;
  schedule: string;
  cost: string;
  resource: string;
  overall: string;
  project?: Project;
}