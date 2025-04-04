import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    return { message: 'User registered', user };
  }

  async validateUser(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: number) {
    return await prisma.user.findUnique({ where: { id: userId } });
  }

  async updateProfile(userId: number, newData: any) {
    return await prisma.user.update({
      where: { id: userId },
      data: newData,
    });
  }
}
