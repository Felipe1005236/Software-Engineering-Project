import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-management')
//@UseGuards(JwtAuthGuard)
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
    const userID = parseInt(id, 10);
    if (isNaN(userID)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userService.findOne(userID);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req): Promise<User | null> {
    console.log('HIT /me endpoint - Full request user object:', JSON.stringify(req.user, null, 2));
    console.log('HIT /me endpoint - userID type:', typeof req.user?.userID);
    console.log('HIT /me endpoint - userId type:', typeof req.user?.userId);
    
    // Try both userID and userId
    const userID = Number(req.user?.userID ?? req.user?.userId);
    console.log('HIT /me endpoint - Final userID value:', userID);
    
    if (!req.user || isNaN(userID)) {
      console.log('HIT /me endpoint - Invalid user or userID:', { user: req.user, userID });
      throw new BadRequestException('Invalid token');
    }
    return this.userService.findOne(userID);
  }

  @Get('me-test')
  getMeTest(@Request() req) {
    console.log('HIT /me-test endpoint');
    return { message: 'me-test works' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateCurrentUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    if (!req.user || !req.user.userID) {
      throw new BadRequestException('Invalid user');
    }
    return this.userService.update(req.user.userID, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteCurrentUser(@Request() req) {
    if (!req.user || !req.user.userID) {
      throw new BadRequestException('Invalid user');
    }
    return this.userService.remove(req.user.userID);
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