import { IsString, IsEmail, IsEnum, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { Role, Type } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsInt()
  unitID?: number;

  @IsEnum(Role)
  @IsOptional()
  primaryRole?: Role = Role.USER;

  @IsEnum(Type)
  @IsOptional()
  type?: Type = Type.INTERNAL;

  @IsBoolean()
  @IsOptional()
  active?: boolean = false;
}