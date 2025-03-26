import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { \[user\]Controller } from './[user/]/[user/].controller';
import { UserController } from './user/user.controller';

//we need a couple more imports for sqlite such as typeorm and sqlite 3

@Module({
  imports: [],
  controllers: [AppController, \[user\]Controller, UserController],
  providers: [AppService],
})
export class AppModule {}
