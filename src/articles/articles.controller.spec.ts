import { Test, TestingModule } from '@nestjs/testing';

import { ArticlesController } from './articles.controller';
import { MockType } from 'src/types';
import { ArticlesService } from './articles.service';
import { NotFoundException } from '@nestjs/common';

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
            findOne: jest.fn(),
            update: jest.fn(),
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

  describe('findAll', () => {
    it('should call service and return expected value', async () => {
      const expectedResult = 'value';

      articlesService.findAll?.mockResolvedValueOnce(expectedResult);

      const result = await articlesController.findAll();

      expect(articlesService.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service and return expected value', async () => {
      const expectedResult = 'value';
      const id = 'id';

      articlesService.findOne?.mockResolvedValueOnce(expectedResult);

      const result = await articlesController.findOne(id);

      expect(articlesService.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });

    it('should throw NotFoundException', async () => {
      articlesService.findOne?.mockResolvedValueOnce(null);

      await expect(articlesController.findOne('')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const id = 'id';
    const updateArticleDto = { title: 'title', description: 'description' };
    const authUser = {
      username: 'user',
      id: 'id',
      sessionVersion: '',
    };

    it('should call service', async () => {
      const expectedResult = true;

      articlesService.update?.mockResolvedValueOnce(expectedResult);

      await articlesController.update(id, updateArticleDto, authUser);

      expect(articlesService.update).toHaveBeenCalledWith(
        id,
        updateArticleDto,
        authUser,
      );
    });

    it('should throw NotFoundException', async () => {
      const expectedResult = false;

      articlesService.update?.mockResolvedValueOnce(expectedResult);

      await expect(
        articlesController.update(id, updateArticleDto, authUser),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
