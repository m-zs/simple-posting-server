import { EntityRepository, Repository } from 'typeorm';

import { AuthUser } from 'src/server/auth';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@EntityRepository(Comment)
export class CommentsRepository extends Repository<Comment> {
  async createComment(
    createCommentDto: CreateCommentDto,
    user: AuthUser,
    articleId: string,
  ): Promise<Comment> {
    const comment = this.create({ ...createCommentDto, user, articleId });

    await this.save(comment);

    return comment;
  }

  async findComment(id: string): Promise<Comment | void> {
    return await this.findOne({ id }, { relations: ['user'] });
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user: AuthUser,
  ): Promise<boolean> {
    return !!(await this.update({ id, user }, updateCommentDto))?.affected;
  }

  async removeComment(id: string, user: AuthUser): Promise<boolean> {
    return !!(await this.delete({ id, user }))?.affected;
  }
}
