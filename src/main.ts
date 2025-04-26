import { HttpErrorFilter } from './plump/projects/http-exception.filter'; 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply the exception filter globally
  app.useGlobalFilters(new HttpErrorFilter());

  await app.listen(3000);
}

bootstrap();
