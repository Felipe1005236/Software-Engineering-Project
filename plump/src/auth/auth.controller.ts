import { Controller, Post, Body, UnauthorizedException, BadRequestException, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestResponseDto } from './dto/request-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      if (!loginDto.email || !loginDto.password) {
        throw new BadRequestException('Email and password are required');
      }
      return await this.authService.login(loginDto.email, loginDto.password);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('request')
  createRequest(@Body() createRequestDto: CreateRequestDto) {
    return this.authService.createRequest(createRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('requests')
  getRequests(@Request() req) {
    return this.authService.getRequests(req.user.unitID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('requests/:id/approve')
  approveRequest(@Param('id') id: string) {
    return this.authService.handleRequest(parseInt(id), { status: 'APPROVED' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('requests/:id/reject')
  rejectRequest(@Param('id') id: string) {
    return this.authService.handleRequest(parseInt(id), { status: 'REJECTED' });
  }
}