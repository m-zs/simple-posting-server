import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/auth-user.type';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PsqlErrorInterceptor } from 'src/shared/interceptors/psql-error.interceptor';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(PsqlErrorInterceptor)
  @ApiOperation({ summary: 'Create new comment' })
  @ApiResponse({ type: Comment })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: AuthUser,
  ): Promise<Comment> {
    return await this.commentsService.create(createCommentDto, user);
  }

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
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
