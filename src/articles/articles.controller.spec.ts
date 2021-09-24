import { Test, TestingModule } from '@nestjs/testing';

import { ArticlesController } from './articles.controller';
import { MockType } from 'src/types';
import { ArticlesService } from './articles.service';

describe('ArticlesController', () => {
  let articlesController: ArticlesController;
  let articlesService: MockType<ArticlesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useFactory: jest.fn(() => ({
            create: jest.fn(),
            findAll: jest.fn(),
          })),
        },
      ],
    }).compile();

    articlesController = module.get<ArticlesController>(ArticlesController);
    articlesService = module.get(ArticlesService);
  });

  describe('create', () => {
    it('should call service and return expected value', async () => {
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

      articlesService.create?.mockResolvedValueOnce(expectedResult);

      const result = await articlesController.create(
        createArticleDto,
        authUser,
      );

      expect(articlesService.create).toHaveBeenCalledWith(
        createArticleDto,
        authUser,
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('create', () => {
    it('should call service and return expected value', async () => {
      const expectedResult = 'value';

      articlesService.findAll?.mockResolvedValueOnce(expectedResult);

      const result = await articlesController.findAll();

      expect(articlesService.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });
});
