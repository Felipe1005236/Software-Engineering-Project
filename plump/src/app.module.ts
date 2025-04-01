import { Module } from '@nestjs/common';
import { ProjectsModule } from './plump/projects/projects.module';

@Module({
  imports: [ProjectsModule],
})
export class AppModule {}

