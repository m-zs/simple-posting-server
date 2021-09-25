import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}
