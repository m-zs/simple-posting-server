import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticleRepository } from './articles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleRepository])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
