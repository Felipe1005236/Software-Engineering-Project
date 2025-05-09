import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsNumber} from 'class-validator';
import {Role , Type} from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  unitID?: number;

  @IsOptional()
  active?: boolean;

  @IsEnum(Role)
  @IsOptional()
  primaryRole?: Role;

  @IsString()
  @IsOptional()
  type?: Type;
} 