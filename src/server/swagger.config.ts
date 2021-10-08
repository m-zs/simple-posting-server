import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Simple posting API')
  .setVersion('1.0')
  .build();
