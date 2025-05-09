import { IsNumber, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TeamRole, AccessLevel } from '@prisma/client';

export class CreateTeamMembershipDto {
  @IsNumber()
  @IsNotEmpty()
  userID: number;

  @IsNumber()
  @IsNotEmpty()
  teamID: number;

  @IsEnum(TeamRole)
  @IsOptional()
  teamRole?: TeamRole = TeamRole.TEAM_MEMBER;

  @IsEnum(AccessLevel)
  @IsOptional()
  accessLevel?: AccessLevel = AccessLevel.READ_ONLY;
} 