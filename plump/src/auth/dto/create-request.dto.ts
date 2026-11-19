import { IsString, IsEmail, IsEnum, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateRequestDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  organizationID: string;

  @IsString()
  unitID: string;

  @IsEnum(Role)
  role: Role;
} 