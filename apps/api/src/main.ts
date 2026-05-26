import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();

  const port = process.env.API_PORT || 3001;
  await app.listen(port);

  Logger.log(`API service running on http://localhost:${port}`, 'Bootstrap');
  Logger.log(`Health check: http://localhost:${port}/api/v1/health`, 'Bootstrap');
}

bootstrap();
