import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserManagementService {
  private users: User[] = [];

<<<<<<< Updated upstream
  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: Date.now().toString(),
      ...createUserDto
    };
    this.users.push(newUser);
    return newUser;
=======
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        active: createUserDto.active ?? false,  
        primaryRole: createUserDto.primaryRole ?? 'USER'  // Default role
      }
    }); 
>>>>>>> Stashed changes
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | null {
    return this.users.find(user => user.id === id) || null;
  }

  update(id: string, updateUserDto: UpdateUserDto): User | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = { 
      ...this.users[userIndex], 
      ...updateUserDto 
    };
    return this.users[userIndex];
  }

  remove(id: string): { deleted: boolean } {
    this.users = this.users.filter(user => user.id !== id);
    return { deleted: true };
  }
}