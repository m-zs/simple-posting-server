import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import sanitizeHtml from 'sanitize-html';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { AuthUser } from 'src/server/auth';
import { CommentsService } from 'src/server/comments/comments.service';
import { CreateCommentDto } from 'src/server/comments/dto/create-comment.dto';
import { Comment } from 'src/server/comments/entities/comment.entity';
import { ArticlesRepository } from '../repositories/articles.repository';
import { Article } from '../entities/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { FindArticleDto } from '../dto/find-article.dto';

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

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<FindArticleDto>> {
    return await this.articlesRepository.findArticles(options);
  }

  async findOne(id: string): Promise<FindArticleDto | void> {
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

    return await this.articlesRepository.removeArticle(id, user);
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

  async paginate(options: IPaginationOptions): Promise<Pagination<Article>> {
    return paginate(this.articlesRepository, options);
  }
}
