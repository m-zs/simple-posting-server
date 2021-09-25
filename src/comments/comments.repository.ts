import { AuthUser } from 'src/auth/auth-user.type';
import { EntityRepository, Repository } from 'typeorm';

import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@EntityRepository(Comment)
export class CommentsRepository extends Repository<Comment> {
  async createComment(
    createCommentDto: CreateCommentDto,
    user: AuthUser,
  ): Promise<Comment> {
    const comment = this.create({ ...createCommentDto, user });

    await this.save(comment);

    return comment;
  }
}
