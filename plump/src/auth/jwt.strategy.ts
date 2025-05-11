import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mySecretKey',
    });
  }

  async validate(payload: any) {
    const userId = parseInt(payload.userId, 10);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID in token');
    }
    return { 
      userId: userId,
      email: payload.email, 
      role: payload.role 
    };
  }
} 