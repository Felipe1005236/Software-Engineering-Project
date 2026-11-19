import { Injectable, CanActivate, ExecutionContext, SetMetadata, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TeamMembershipService } from '../../team-membership/team-membership.service';

export const RequiredAccess = (access: 'READ_ONLY' | 'READ_WRITE' | 'FULL_ACCESS') => 
  SetMetadata('requiredAccess', access);

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  private readonly logger = new Logger(ProjectAccessGuard.name);

  constructor(
    private reflector: Reflector,
    private teamMembershipService: TeamMembershipService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAccess = this.reflector.get<string>('requiredAccess', context.getHandler()) || 'READ_ONLY';
    const request = context.switchToHttp().getRequest();
    
    // Extract user ID and role from request
    const userId = request.user?.userID;
    const userRole = request.user?.role;
    this.logger.debug(`User ID from request: ${userId}, Role: ${userRole}`);
    
    // Extract project ID from params (check both 'id' and 'projectId')
    const projectId = request.params.id || request.params.projectId;
    this.logger.debug(`Project ID from params: ${projectId}`);
    
    if (!userId || !projectId) {
      this.logger.debug('Missing userId or project id');
      return false;
    }

    // Allow admin users full access
    if (userRole === 'ADMIN') {
      this.logger.debug('Admin user - granting full access');
      return true;
    }

    // Check project access for non-admin users
    const accessCheck = await this.teamMembershipService.checkProjectAccess(
      +userId,
      +projectId,
      requiredAccess as any
    );
    
    this.logger.debug(`Access check result: ${JSON.stringify(accessCheck)}`);
    return accessCheck.hasAccess;
  }
} 