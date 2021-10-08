import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { configService } from './config';
import { swaggerConfig } from './swagger.config';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { PsqlErrorInterceptor } from './shared/interceptors/psql-error.interceptor';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { TrimInputPipe } from './shared/pipes/trim-input.pipe';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = configService.getPort()!;

  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const { httpAdapter } = app.get(HttpAdapterHost);

  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
  app.useGlobalPipes(new TrimInputPipe());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new PsqlErrorInterceptor());

  await app.listen(port);
  Logger.log(`Listening at port: ${port}`);
}

bootstrap();
