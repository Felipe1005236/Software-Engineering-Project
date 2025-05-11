import { IsString, IsEmail, IsEnum, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { Role, Type } from '@prisma/client';

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

  @IsString()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsInt()
  unitID?: number;

  @IsEnum(Role)
  @IsOptional()
  primaryRole?: Role;

  @IsEnum(Type)
  @IsOptional()
  type?: Type;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
} 