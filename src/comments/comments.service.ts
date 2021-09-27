import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import sanitizeHtml from 'sanitize-html';

import { AuthUser } from 'src/auth/auth-user.type';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async createForArticle(
    createCommentDto: CreateCommentDto,
    user: AuthUser,
    articleId: string,
  ): Promise<Comment> {
    return await this.commentsRepository.createComment(
      {
        ...createCommentDto,
        description: sanitizeHtml(createCommentDto.description),
      },
      user,
      articleId,
    );
  }

  async findOne(id: string): Promise<Comment | void> {
    return await this.commentsRepository.findComment(id);
  }

  update(id: number, _updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
