import { Test, TestingModule } from '@nestjs/testing';
import sanitizeHtml from 'sanitize-html';

import { MockType } from 'src/types';
import { ArticlesService } from './articles.service';
import { ArticlesRepository } from './articles.repository';
import { CommentsService } from 'src/comments/comments.service';
import { CommentsModule } from 'src/comments/comments.module';

jest.mock('sanitize-html');

describe('ArticlesService', () => {
  let articlesService: ArticlesService;
  let articlesRepository: MockType<ArticlesRepository>;

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
  });

  describe('create', () => {
    it('should call repository and return expected value', async () => {
      const createArticleDto = {
        title: 'title',
        description: 'description',
      };
      const authUser = {
        username: 'user',
        id: 'id',
        sessionVersion: '',
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
    it('should call repository and return expected value', async () => {
      const expectedResult = 'value';
      const id = 'id';
      const updateArticleDto = { title: 'title', description: 'description' };
      const authUser = {
        username: 'user',
        id: 'id',
        sessionVersion: '',
      };

      (sanitizeHtml as unknown as jest.Mock).mockImplementation((val) => val);
      articlesRepository.updateArticle?.mockResolvedValueOnce(expectedResult);

      const result = await articlesService.update(
        id,
        updateArticleDto,
        authUser,
      );

      expect(sanitizeHtml).toHaveBeenCalledTimes(2);
      expect(articlesRepository.updateArticle).toHaveBeenCalledWith(
        id,
        updateArticleDto,
        authUser,
      );
      expect(result).toBe(expectedResult);
    });
  });
});
