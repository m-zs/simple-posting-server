import { ApiProperty } from '@nestjs/swagger';

import { Article } from '../entities/article.entity';

export class FindArticleDto extends Article {
  @ApiProperty()
  commentsCount: number;
}
