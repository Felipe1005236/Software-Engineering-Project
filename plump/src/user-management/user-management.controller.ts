import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userService: UserManagementService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req): Promise<User | null> {
    console.log('req.user in /me:', req.user);
    const userId = Number(req.user?.userID);
    if (!req.user || isNaN(userId)) {
      throw new BadRequestException('Invalid token');
    }
    return this.userService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateCurrentUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User | null> {
    const userId = Number(req.user?.userID);
    if (!req.user || isNaN(userId)) {
      throw new BadRequestException('Invalid token');
    }
    return this.userService.update(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteCurrentUser(@Request() req): Promise<{ deleted: boolean }> {
    const userId = Number(req.user?.userID);
    if (!req.user || isNaN(userId)) {
      throw new BadRequestException('Invalid token');
    }
    return this.userService.remove(userID);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User | null> {
    const userID = parseInt(id, 10);
    if (isNaN(userID)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userService.update(userID, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userService.remove(userId);
  }
}