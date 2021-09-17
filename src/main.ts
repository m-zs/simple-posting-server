import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { configService } from './config';
import { swaggerConfig } from './swagger.config';
import { DEV_LOGGER_CFG, PROD_LOGGER_CFG } from './logger';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = configService.getPort();
  const logger = WinstonModule.createLogger(
    configService.isProduction() ? PROD_LOGGER_CFG : DEV_LOGGER_CFG,
  );
  const app = await NestFactory.create(AppModule, { logger });
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  logger.log(`Listening at port: ${port}`);
}

bootstrap();
