import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('JwtAuthGuard canActivate called');
    const req = context.switchToHttp().getRequest();
    console.log('JwtAuthGuard headers:', req.headers);
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      console.log('JwtAuthGuard handleRequest: error or no user', { err, user, info });
      throw err || new UnauthorizedException();
    }
    console.log('JwtAuthGuard handleRequest: returning user', user);
    return user;
  }
}