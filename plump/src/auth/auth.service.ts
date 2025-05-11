import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserManagementService } from '../user-management/user-management.service';
import { CreateUserDto } from '../user-management/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserManagementService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(data: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
      include: {
        unit: true,
        teamMemberships: true,
      },
    });

    const { password: _, ...result } = user;
    return { message: 'User registered successfully', user: result };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { 
      email: user.email, 
      userId: user.userID,
      role: user.primaryRole 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}