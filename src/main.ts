import { HttpErrorFilter } from './plump/projects/http-exception.filter'; 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD:src/main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply the exception filter globally
  app.useGlobalFilters(new HttpErrorFilter());

  await app.listen(3000);
=======
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
>>>>>>> origin/main:plump/src/main.ts
}

bootstrap();
