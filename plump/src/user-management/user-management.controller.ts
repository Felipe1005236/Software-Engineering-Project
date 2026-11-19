import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-management')
@UseGuards(JwtAuthGuard)
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

  @Get('me')
  async getCurrentUser(@Request() req): Promise<User | null> {
    const userID = req.user?.userID;
    if (!userID) {
      throw new BadRequestException('Invalid token');
    }
    return this.userService.findOne(userID);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    const userID = parseInt(id, 10);
    if (isNaN(userID)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userService.findOne(userID);
  }

  @Get('me-test')
  getMeTest(@Request() req) {
    console.log('HIT /me-test endpoint');
    return { message: 'me-test works' };
  }

  @Get('unit/:unitId')
  async findByUnit(@Param('unitId') unitId: string) {
    return this.userService.findByUnit(+unitId);
  }

  @Patch('me')
  async updateCurrentUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userID = req.user?.userID;
    if (!userID) {
      throw new BadRequestException('Invalid token');
    }
    return this.userService.update(userID, updateUserDto);
  }

  @Delete('me')
  async deleteCurrentUser(@Request() req) {
    const userID = req.user?.userID;
    if (!userID) {
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
    const userID = parseInt(id, 10);
    if (isNaN(userID)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userService.remove(userID);
  }
}