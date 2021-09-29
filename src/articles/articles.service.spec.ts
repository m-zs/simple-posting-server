import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';

import { MockType } from 'src/types';
import { ArticlesService } from './articles.service';
import { ArticlesRepository } from './articles.repository';
import { CommentsService } from 'src/comments/comments.service';
import { CommentsModule } from 'src/comments/comments.module';
import { Article } from './entities/article.entity';

jest.mock('sanitize-html');

describe('ArticlesService', () => {
  let articlesService: ArticlesService;
  let articlesRepository: MockType<ArticlesRepository>;
  let commentsService: MockType<CommentsService>;
  const authUser = {
    username: 'user',
    id: 'id',
    sessionVersion: '',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        {
          module: class FakeComments {},
          providers: [{ provide: CommentsModule, useFactory: jest.fn() }],
        },
      ],
      providers: [
        ArticlesService,
        {
          provide: ArticlesRepository,
          useFactory: jest.fn(() => ({
            createArticle: jest.fn(),
            findArticles: jest.fn(),
            findArticle: jest.fn(),
            updateArticle: jest.fn(),
          })),
        },
        {
          provide: CommentsService,
          useFactory: jest.fn(() => ({ createForArticle: jest.fn() })),
        },
      ],
    }).compile();

    articlesService = module.get<ArticlesService>(ArticlesService);
    articlesRepository = module.get(ArticlesRepository);
    commentsService = module.get(CommentsService);
  });

  describe('create', () => {
    it('should call repository and return expected value', async () => {
      const createArticleDto = {
        title: 'title',
        description: 'description',
      };
      const expectedResult = 'value';

      (sanitizeHtml as unknown as jest.Mock).mockImplementation((val) => val);
      articlesRepository.createArticle?.mockResolvedValueOnce(expectedResult);

      const result = await articlesService.create(createArticleDto, authUser);

      expect(sanitizeHtml).toHaveBeenCalledTimes(2);
      expect(articlesRepository.createArticle).toHaveBeenCalledWith(
        createArticleDto,
        authUser,
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('getAll', () => {
    it('should call repository and return expected value', async () => {
      const expectedResult = 'value';

      articlesRepository.findArticles?.mockResolvedValueOnce(expectedResult);

      const result = await articlesService.findAll();

      expect(articlesRepository.findArticles).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });

  describe('getOne', () => {
    it('should call repository and return expected value', async () => {
      const expectedResult = 'value';
      const id = 'id';

      articlesRepository.findArticle?.mockResolvedValueOnce(expectedResult);

      const result = await articlesService.findOne(id);

      expect(articlesRepository.findArticle).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });
  });

  describe('update', () => {
    const expectedResult = 'value';
    const id = 'id';
    const updateArticleDto = { title: 'title', description: 'description' };

    it('should call repository and return expected value', async () => {
      (sanitizeHtml as unknown as jest.Mock).mockImplementation((val) => val);
      articlesRepository.updateArticle?.mockResolvedValueOnce(expectedResult);
      jest
        .spyOn(articlesService, 'findOne')
        .mockResolvedValueOnce({} as Article);

      const result = await articlesService.update(
        id,
        updateArticleDto,
        authUser,
      );

      expect(articlesService.findOne).toHaveBeenCalledWith(id);
      expect(sanitizeHtml).toHaveBeenCalledTimes(2);
      expect(articlesRepository.updateArticle).toHaveBeenCalledWith(
        id,
        updateArticleDto,
        authUser,
      );
      expect(result).toBe(expectedResult);
    });

    it('should call findOne and throw NotFoundException when article is not found', async () => {
      jest.spyOn(articlesService, 'findOne').mockResolvedValueOnce(undefined);

      await expect(
        articlesService.update(id, updateArticleDto, authUser),
      ).rejects.toThrowError(NotFoundException);

      expect(articlesService.findOne).toHaveBeenCalledWith(id);
      expect(sanitizeHtml).toHaveBeenCalledTimes(0);
    });
  });

  describe('createComment', () => {
    it('should call service and return expected value', async () => {
      const expectedResult = 'value';
      const id = 'id';
      const createCommentDto = { description: 'desc' };

      commentsService.createForArticle?.mockResolvedValueOnce(expectedResult);

      const result = await articlesService.createComment(
        createCommentDto,
        authUser,
        id,
      );

      expect(commentsService.createForArticle).toHaveBeenCalledWith(
        createCommentDto,
        authUser,
        id,
      );
      expect(result).toBe(expectedResult);
    });
  });
});
