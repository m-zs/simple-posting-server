import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity()
export class Article {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createDate: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updateDate: Date;

  @Exclude({ toPlainOnly: true })
  @ManyToOne((_type) => User, (user) => user.articles)
  user: User;

  @OneToMany((_type) => Comment, (comment) => comment.article)
  comments?: Comment[];
}
