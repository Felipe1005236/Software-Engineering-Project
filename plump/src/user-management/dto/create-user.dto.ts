export class CreateUserDto {
<<<<<<< Updated upstream
    readonly name: string;
    readonly email: string;
    readonly password: string;
  }
=======
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
>>>>>>> Stashed changes
