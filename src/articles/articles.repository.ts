import { AuthUser } from 'src/auth/auth-user.type';
import { EntityRepository, Repository } from 'typeorm';

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

  async findArticles(): Promise<Article[]> {
    return await this.createQueryBuilder('article')
      .leftJoin('article.user', 'user')
      .addSelect('user.id')
      .addSelect('user.username')
      .getMany();
  }

  async findArticle(id: string): Promise<Article | undefined> {
    return await this.findOne({ id });
  }

  async updateArticle(
    id: string,
    updateArticleDto: UpdateArticleDto,
    user: AuthUser,
  ): Promise<boolean> {
    return !!(await this.update({ id, user }, updateArticleDto))?.affected;
  }
}
