import { Controller, Post, Body, Get, Patch, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body) {
    return this.authService.register(body.username, body.email, body.password);
  }

  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (user) {
      return this.authService.login(user);
    }
    return { message: 'Invalid credentials' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() body) {
    return this.authService.updateProfile(req.user.userId, body);
  }

  @Post('refresh')
  async refreshToken(@Body() body) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (user) {
      return this.authService.login(user);
    }
    return { message: 'Invalid credentials' };
  }
}
