import { AuthUser } from 'src/auth/auth-user.type';
import { EntityRepository, Repository } from 'typeorm';

import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';

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
}
