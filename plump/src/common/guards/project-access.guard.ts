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
    
    // Extract user ID from request (depends on your auth implementation)
    const userId = request.user?.userID;
    this.logger.debug(`User ID from request: ${userId}`);
    
    // Extract project ID from params
    const { id } = request.params;
    this.logger.debug(`Project ID from params: ${id}`);
    
    if (!userId || !id) {
      this.logger.debug('Missing userId or project id');
      return false;
    }

    // Check project access
    const accessCheck = await this.teamMembershipService.checkProjectAccess(
      +userId,
      +id,
      requiredAccess as any
    );
    
    this.logger.debug(`Access check result: ${JSON.stringify(accessCheck)}`);
    return accessCheck.hasAccess;
  }
} 