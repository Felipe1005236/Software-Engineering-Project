import { Role, Type, Team, Task} from '@prisma/client';

export interface User {
  userID: number;              
  firstName: string;          
  lastName: string;          
  email: string;  
  phone: string;             
  address: string;          
  unit: string;            
  unitManager: string;       
  activationDate: Date;       
  active: boolean;           
  primaryRole: Role;        
  type: Type;               

  // Optional: Include relationships if needed
  teams?: Team[];       // From Prisma schema
  assignedTasks?: Task[];     // From Prisma schema
}