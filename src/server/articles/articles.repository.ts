import { AuthUser } from '~server/auth/auth-user.type';
import { EntityRepository, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

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
    withComments?: boolean,
  ): Promise<Pagination<Article>> {
    const builder = this.createQueryBuilder('article')
      .leftJoin('article.user', 'user')
      .addSelect('user.id')
      .addSelect('user.username');

    if (withComments) {
      builder
        .addSelect('user.username')
        .leftJoinAndSelect('article.comments', 'comment');
    }

    return await paginate<Article>(builder, options);
  }

  async findArticle(
    id: string,
    withComments?: boolean,
  ): Promise<Article | undefined> {
    const builder = this.createQueryBuilder('article')
      .leftJoin('article.user', 'user')
      .addSelect('user.id')
      .addSelect('user.username')
      .where({ id });

    if (withComments) {
      builder
        .addSelect('user.username')
        .leftJoinAndSelect('article.comments', 'comment');
    }

    return await builder.getOne();
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
