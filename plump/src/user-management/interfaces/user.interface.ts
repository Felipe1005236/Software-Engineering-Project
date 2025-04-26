import { Role } from '@prisma/client';

interface User {
  id: number;
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
  type: string;
}


export { User };