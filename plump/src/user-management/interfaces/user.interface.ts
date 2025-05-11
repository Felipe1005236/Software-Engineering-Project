import { Role, Type, TeamRole, AccessLevel } from '@prisma/client';

export interface User {
  userID: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  unitID: number | null;
  activationDate: Date;
  active: boolean;
  primaryRole: Role;
  type: Type;
  password: string;
  unit: {
    unitID: number;
    name: string;
    description: string | null;
    managerID: number | null;
    organizationID: number;
  } | null;
  teamMemberships: Array<{
    membershipID: number;
    teamID: number;
    userID: number;
    teamRole: TeamRole;
    accessLevel: AccessLevel;
    joinedAt: Date;
  }>;
}