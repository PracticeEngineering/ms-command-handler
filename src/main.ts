// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe()); // Habilita la validación de DTOs
  
  app.enableShutdownHooks();
  await app.listen(port);
  console.log(`Checkpoint processor service started on port ${port}, and is listening for Pub/Sub messages.`);
}
bootstrap();