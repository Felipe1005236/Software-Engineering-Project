import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mySecretKey',
    });
  }

  async validate(payload: any) {
    console.log('JWT payload in validate:', payload); // <-- Add this line
    const userId = parseInt(payload.userId, 10);
    if (isNaN(userId)) {
      throw new UnauthorizedException('Invalid user ID in token');
    }
  
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { userID: userId }
    });
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    const result = { 
      userId: userId,
      email: payload.email, 
      role: payload.role 
    };
    console.log('JWT validate returns:', result); // <-- Add this line
    return result;
  }
} 

