import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('JwtAuthGuard canActivate called');
    const req = context.switchToHttp().getRequest();
    console.log('JwtAuthGuard headers:', req.headers);
    return super.canActivate(context);
  }
}