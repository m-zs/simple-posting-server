import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import sanitizeHtml from 'sanitize-html';

import { AuthUser } from 'src/auth/auth-user.type';
import { ArticlesRepository } from './articles.repository';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesRepository)
    private readonly articlesRepository: ArticlesRepository,
    private readonly commentsService: CommentsService,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    user: AuthUser,
  ): Promise<Article> {
    return await this.articlesRepository.createArticle(
      {
        title: sanitizeHtml(createArticleDto.title),
        description: sanitizeHtml(createArticleDto.description),
      },
      user,
    );
  }

  async findAll(): Promise<Article[]> {
    return await this.articlesRepository.findArticles();
  }

  async findOne(id: string): Promise<Article | void> {
    return await this.articlesRepository.findArticle(id);
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    user: AuthUser,
  ): Promise<boolean> {
    if (!(await this.findOne(id))) {
      throw new NotFoundException();
    }

    const { title, description } = updateArticleDto;

    return await this.articlesRepository.updateArticle(
      id,
      {
        ...(title && { title: sanitizeHtml(title) }),
        ...(description && { description: sanitizeHtml(description) }),
      },
      user,
    );
  }

  async remove(id: string, user: AuthUser): Promise<boolean> {
    if (!(await this.findOne(id))) {
      throw new NotFoundException();
    }

    return await this.articlesRepository.deleteArticle(id, user);
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    user: AuthUser,
    id: string,
  ): Promise<Comment> {
    return await this.commentsService.createForArticle(
      createCommentDto,
      user,
      id,
    );
  }
}
