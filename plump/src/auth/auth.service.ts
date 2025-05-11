import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserManagementService } from '../user-management/user-management.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserManagementService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    return { message: 'User registered', user };
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
    const payload = { email: user.email, sub: user.userID };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
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
    D user: user,
    };
  }
}