import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TeamMembershipService } from '../../team-membership/team-membership.service';

export const RequiredAccess = (access: 'READ_ONLY' | 'READ_WRITE' | 'FULL_ACCESS') => 
  SetMetadata('requiredAccess', access);

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private teamMembershipService: TeamMembershipService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAccess = this.reflector.get<string>('requiredAccess', context.getHandler()) || 'READ_ONLY';
    const request = context.switchToHttp().getRequest();
    
    // Extract user ID from request (depends on your auth implementation)
    const userId = request.user?.userID;
    
    // Extract project ID from params
    const { projectId } = request.params;
    
    if (!userId || !projectId) {
      return false;
    }

    // Check project access
    const accessCheck = await this.teamMembershipService.checkProjectAccess(
      +userId,
      +projectId,
      requiredAccess as any
    );

    return accessCheck.hasAccess;
  }
} 