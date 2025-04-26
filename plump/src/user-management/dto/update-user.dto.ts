import { Role } from '@prisma/client';
import { 
  IsEmail, 
  IsEnum, 
  IsOptional, 
  IsString 
} from 'class-validator';

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
  unit?: string;

  @IsString()
  @IsOptional()
  unitManager?: string;

  @IsOptional()
  active?: boolean;

  @IsEnum(Role)
  @IsOptional()
  primaryRole?: Role;

  @IsString()
  @IsOptional()
  type?: string;
}