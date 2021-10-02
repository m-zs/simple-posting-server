import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Article } from 'src/articles/entities/article.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Exclude({ toPlainOnly: true })
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  sessionVersion: string;

  @OneToMany((_type) => Article, (article) => article.user)
  articles: Article[];

  @OneToMany((_type) => Comment, (comment) => comment.user)
  comments: Comment[];
}
