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
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { TransformInterceptorIgnore } from 'src/server/shared/interceptors/transform.interceptor';
import { ValidatePayloadExistsPipe } from 'src/server/shared/pipes/validate-payload-exist.pipe';
import { PaginationResponse } from 'src/server/shared/decorators/pagination-response.decorator';
import { AuthUser, GetUser, JwtGuard } from 'src/server/auth';
import { CreateCommentDto, Comment } from 'src/server/comments';
import { PaginationDto } from 'src/server/shared/dto/pagination.dto';
import { ArticlesService } from '../services/articles.service';
import { Article } from '../entities/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';
import { FindArticleDto } from '../dto/find-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';

@Controller('api/articles')
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
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Get all articles' })
  @PaginationResponse(FindArticleDto)
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<Pagination<FindArticleDto>> {
    return await this.articlesService.findAll({ ...paginationDto });
  }

  @Get(':id')
  @TransformInterceptorIgnore()
  @ApiOperation({ summary: 'Get article by id' })
  @ApiParam({ name: 'id', description: 'Article id' })
  @ApiResponse({ type: FindArticleDto })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FindArticleDto | void> {
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
