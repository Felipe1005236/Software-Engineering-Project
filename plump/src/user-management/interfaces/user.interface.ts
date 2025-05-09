import { Role, Type, Unit, Task, TeamMembership } from '@prisma/client';

export interface User {
  userID: number;              
  firstName: string;          
  lastName: string;          
  email: string;  
  phone: string;             
  address: string;          
  unitID: number;            
  activationDate: Date;       
  active: boolean;           
  primaryRole: Role;        
  type: Type;               

  // Include relationships
  unit: Unit;
  teamMemberships?: TeamMembership[];
  tasks?: Task[];
}