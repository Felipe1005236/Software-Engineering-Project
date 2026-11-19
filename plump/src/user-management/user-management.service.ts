import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserManagementService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      include: {
        unit: true,
        teamMemberships: true,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        unit: true,
        teamMemberships: true,
      },
    });
  }

  async findOne(id: number): Promise<User | null> {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Invalid user ID');
    }
    return this.prisma.user.findUnique({
      where: {
        userID: id,
      },
      include: {
        unit: true,
        teamMemberships: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        unit: true,
        teamMemberships: true,
      },
    });
  }

  async findByUnit(unitId: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        unitID: unitId,
      },
      include: {
        unit: true,
        teamMemberships: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Invalid user ID');
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.prisma.user.update({
      where: { userID: id },
      data: updateUserDto,
      include: {
        unit: true,
        teamMemberships: true,
      },
    });
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new Error('Invalid user ID');
    }
    await this.prisma.user.delete({
      where: { userID: id },
    });
    return { deleted: true };
  }
}