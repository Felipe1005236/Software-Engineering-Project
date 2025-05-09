import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsNumber } from 'class-validator';
import {Role, Type} from '@prisma/client';

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

  @IsNumber()
  @IsNotEmpty()
  unitID: number;

  @IsOptional()
  active?: boolean;

  @IsEnum(Role)
  @IsOptional()
  primaryRole?: Role;

  @IsString()
  type: Type;
}