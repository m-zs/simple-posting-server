import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  UseGuards,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthUser } from 'src/auth/auth-user.type';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ValidatePayloadExistsPipe } from 'src/shared/pipes/validate-payload-exist.pipe';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Find comment by id' })
  @ApiParam({ name: 'id', description: 'Comment id' })
  @ApiResponse({ type: Comment })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Comment | void> {
    const comment = await this.commentsService.findOne(id);

    if (!comment) {
      throw new NotFoundException();
    }

    return comment;
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update comment' })
  @ApiParam({ name: 'commentId', description: 'Comment id' })
  @HttpCode(204)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidatePayloadExistsPipe()) updateCommentDto: UpdateCommentDto,
    @GetUser() user: AuthUser,
  ): Promise<void> {
    if (!(await this.commentsService.update(id, updateCommentDto, user))) {
      throw new ForbiddenException();
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
