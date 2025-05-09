import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserManagementService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        active: createUserDto.active ?? false,  
        primaryRole: createUserDto.primaryRole ?? 'USER'  
      },
      include: {
        unit: true
      }
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        unit: true,
        teamMemberships: true
      }
    });
  }

  async findOne(id: number) {  
    return this.prisma.user.findUnique({
      where: { userID: id },
      include: {
        unit: true,
        teamMemberships: true
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { userID: id },
      data: updateUserDto,
      include: {
        unit: true
      }
    });
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.prisma.user.delete({
      where: { userID: id },
    });
    return { deleted: true };
  }
}