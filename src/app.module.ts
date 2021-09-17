import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configService } from './config';

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig())],
})
export class AppModule {}
