import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { TeamMembershipService } from '../team-membership/team-membership.service';

@Injectable()
export class StakeholderAccessGuard implements CanActivate {
  private readonly logger = new Logger(StakeholderAccessGuard.name);

  constructor(private teamMembershipService: TeamMembershipService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Extract user ID and role from request
    const userId = request.user?.userID;
    const userRole = request.user?.role;
    this.logger.debug(`User ID from request: ${userId}, Role: ${userRole}`);
    
    // Get project ID from request params
    const projectId = request.params.projectId;
    this.logger.debug(`Project ID from params: ${projectId}`);
    
    if (!userId || !projectId) {
      this.logger.debug('Missing userId or projectId');
      return false;
    }

    // Allow admin users full access
    if (userRole === 'ADMIN') {
      this.logger.debug('Admin user - granting full access');
      return true;
    }

    // For non-admin users, check project team membership
    try {
      const accessCheck = await this.teamMembershipService.checkProjectAccess(
        +userId,
        +projectId,
        'READ_ONLY' // Use READ_ONLY as minimum access level
      );
      
      this.logger.debug(`Access check result: ${JSON.stringify(accessCheck)}`);
      return accessCheck.hasAccess;
    } catch (error) {
      this.logger.error(`Error checking access: ${error}`);
      return false;
    }
  }
} 