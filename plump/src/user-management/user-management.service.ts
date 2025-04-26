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
        primaryRole: createUserDto.primaryRole ?? 'USER'  // Default role
      }
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {  
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}