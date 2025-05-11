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
    console.log('JWT payload in validate:', payload);
    // Handle both userId and userID in payload
    const userID = parseInt(payload.userID || payload.userId, 10);
    if (isNaN(userID)) {
      throw new UnauthorizedException('Invalid user ID in token');
    }
  
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { userID: userID }
    });
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    const result = { 
      userID: userID,
      email: payload.email, 
      role: payload.role 
    };
    console.log('JWT validate returns:', result);
    return result;
  }
} 

