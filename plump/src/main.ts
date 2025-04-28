import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8080', // allow frontend container to access backend
  });
  
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);


}
bootstrap();
