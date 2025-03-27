import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

//we need a couple more imports for sqlite such as typeorm and sqlite 3

@Module({
  imports: [UsersModule],
  providers: [AppService],
})
export class AppModule {}
