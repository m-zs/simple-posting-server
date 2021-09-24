import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthUser } from 'src/auth/auth-user.type';
import { ArticlesRepository } from './articles.repository';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesRepository)
    private readonly articlesRepository: ArticlesRepository,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    user: AuthUser,
  ): Promise<Article> {
    return await this.articlesRepository.createArticle(createArticleDto, user);
  }

  async findAll(): Promise<Article[]> {
    return await this.articlesRepository.findArticles();
  }

  async findOne(id: string): Promise<Article | undefined> {
    return await this.articlesRepository.findArticle(id);
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    user: AuthUser,
  ): Promise<boolean> {
    return await this.articlesRepository.updateArticle(
      id,
      updateArticleDto,
      user,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
