import { EntityRepository, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { AuthUser } from 'src/server/auth';
import { Article } from '../entities/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { FindArticleDto } from '../dto/find-article.dto';

@EntityRepository(Article)
export class ArticlesRepository extends Repository<Article> {
  async createArticle(
    createArticleDto: CreateArticleDto,
    user: AuthUser,
  ): Promise<Article> {
    const article = this.create({ ...createArticleDto, user });

    await this.save(article);

    return article;
  }

  async findArticles(
    options: IPaginationOptions,
  ): Promise<Pagination<FindArticleDto>> {
    const builder = this.createQueryBuilder('article')
      .leftJoin('article.user', 'user')
      .addSelect('user.id')
      .loadRelationCountAndMap('article.commentsCount', 'article.comments');

    return (await paginate<Article>(
      builder,
      options,
    )) as Pagination<FindArticleDto>;
  }

  async findArticle(id: string): Promise<FindArticleDto | undefined> {
    return (await this.createQueryBuilder('article')
      .leftJoin('article.user', 'user')
      .addSelect('user.id')
      .loadRelationCountAndMap('article.commentsCount', 'article.comments')
      .where({ id })
      .getOne()) as FindArticleDto | undefined;
  }

  async updateArticle(
    id: string,
    updateArticleDto: UpdateArticleDto,
    user: AuthUser,
  ): Promise<boolean> {
    return !!(await this.update({ id, user }, updateArticleDto))?.affected;
  }

  async removeArticle(id: string, user: AuthUser): Promise<boolean> {
    return !!(await this.delete({ id, user }))?.affected;
  }
}
