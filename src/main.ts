import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

import { configService } from './config';
import { swaggerConfig } from './swagger.config';
import { TransformInterceptor } from './shared/interceptors/transform-interceptor';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = configService.getPort();

  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const { httpAdapter } = app.get(HttpAdapterHost);

  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  Logger.log(`Listening at port: ${port}`);
}

bootstrap();
