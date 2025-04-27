export class UpdateUserDto {
<<<<<<< Updated upstream
    readonly name?: string;
    readonly email?: string;
    readonly password?: string;
  }
=======
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
>>>>>>> Stashed changes
