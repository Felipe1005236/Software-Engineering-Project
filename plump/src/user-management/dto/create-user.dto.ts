import { Role } from '@prisma/client';
import { 
  IsEmail, 
  IsEnum, 
  IsNotEmpty, 
  IsOptional, 
  IsString 
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  unit: string;

  @IsString()
  unitManager: string;

  @IsOptional()
  active?: boolean;

  @IsEnum(Role)
  @IsOptional()
  primaryRole?: Role;

  @IsString()
  type: string;
}