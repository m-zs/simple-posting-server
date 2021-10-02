import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Article } from 'src/server/articles/entities/article.entity';
import { User } from 'src/server/users/entities/user.entity';

@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: true })
  responseTo: string;

  @Exclude({ toPlainOnly: true })
  @ManyToOne((_type) => User, (user) => user.comments)
  user: User;

  @ManyToOne((_type) => Article, (article) => article.comments)
  @JoinColumn()
  article: Article;

  @Column()
  articleId: Article['id'];
}
