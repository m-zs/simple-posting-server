import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticlesRepository } from './articles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ArticlesRepository])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
