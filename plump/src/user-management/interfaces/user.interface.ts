import { Role, Type } from '@prisma/client';

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

  // Include relationships
  unit: any;
  teamMemberships?: any[];
  tasks?: any[];
}