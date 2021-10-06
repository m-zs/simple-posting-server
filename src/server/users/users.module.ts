import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/server/auth/auth.module';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, Logger],
})
export class UsersModule {}
