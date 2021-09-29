import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  NotFoundException,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/auth/auth-user.type';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { Comment } from 'src/comments/entities/comment.entity';
import { TransformInterceptorIgnore } from 'src/shared/interceptors/transform.interceptor';
import { ValidatePayloadExistsPipe } from 'src/shared/pipes/validate-payload-exist.pipe';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Create new article' })
  @ApiResponse({ type: Article })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @GetUser() user: AuthUser,
  ): Promise<Article> {
    return await this.articlesService.create(createArticleDto, user);
  }

  @Get()
  @TransformInterceptorIgnore()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ type: [Article] })
  async findAll(): Promise<Article[]> {
    return await this.articlesService.findAll();
  }

  @Get(':id')
  @TransformInterceptorIgnore()
  @ApiOperation({ summary: 'Get article by id' })
  @ApiParam({ name: 'id', description: 'Article id' })
  @ApiResponse({ type: Article })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Article | undefined> {
    const article = await this.articlesService.findOne(id);

    if (!article) {
      throw new NotFoundException();
    }

    return article;
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update article' })
  @ApiParam({ name: 'id', description: 'Article id' })
  @HttpCode(204)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidatePayloadExistsPipe()) updateArticleDto: UpdateArticleDto,
    @GetUser() user: AuthUser,
  ): Promise<void> {
    if (!(await this.articlesService.update(id, updateArticleDto, user))) {
      throw new ForbiddenException();
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete article' })
  @ApiParam({ name: 'id', description: 'Article id' })
  @HttpCode(204)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: AuthUser,
  ): Promise<void> {
    if (!(await this.articlesService.remove(id, user))) {
      throw new ForbiddenException();
    }
  }

  @Post(':id/comments')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Create new comment for article' })
  @ApiResponse({ type: Comment })
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Comment> {
    return await this.articlesService.createComment(createCommentDto, user, id);
  }
}
