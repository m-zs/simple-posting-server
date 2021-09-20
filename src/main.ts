import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { configService } from './config';
import { swaggerConfig } from './swagger.config';
import { DEV_LOGGER_CFG, PROD_LOGGER_CFG } from './logger';
import { TransformInterceptor } from './shared/interceptors/transform-interceptor';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = configService.getPort();
  const logger = WinstonModule.createLogger(
    configService.isProduction() ? PROD_LOGGER_CFG : DEV_LOGGER_CFG,
  );
  const app = await NestFactory.create(AppModule, { logger });
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const { httpAdapter } = app.get(HttpAdapterHost);

  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  logger.log(`Listening at port: ${port}`);
}

bootstrap();
