import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionLoggerFilter } from './infrastructure/common/filters/global-exception-logger.filter';
import { LOGGER_PROVIDER_TOKEN } from './infrastructure/logger/logger.constants';
import { Logger } from 'pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Disable Nest's default logger to use our own
    logger: false,
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  const appLogger = app.get<Logger>(LOGGER_PROVIDER_TOKEN);
  
  app.useGlobalPipes(new ValidationPipe()); // Habilita la validación de DTOs
  app.useGlobalFilters(new GlobalExceptionLoggerFilter(httpAdapterHost, appLogger));
  
  const port = process.env.PORT || 3000;
  app.enableShutdownHooks();
 
  await app.listen(port);
  appLogger.info(
    `Service started on port ${port}`,
  );
}
bootstrap();