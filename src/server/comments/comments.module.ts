import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsService } from './services/comments.service';
import { CommentsController } from './controllers/comments.controller';
import { CommentsRepository } from './repositories/comments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsRepository])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
