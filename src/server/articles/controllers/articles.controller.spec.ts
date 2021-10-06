import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

import { MockType } from 'src/server/types';
import { ArticlesService } from '../services/articles.service';
import { ArticlesController } from './articles.controller';

describe('ArticlesController', () => {
  let articlesController: ArticlesController;
  let articlesService: MockType<ArticlesService>;
  const authUser = {
    username: 'user',
    id: 'id',
    sessionVersion: '',
  };
  const expectedResult = 'value';
  const id = 'id';

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
            createComment: jest.fn(),
            remove: jest.fn(),
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
    const paginationDto = { page: 1, limit: 10 };

    it('should call service and return expected value', async () => {
      articlesService.findAll?.mockResolvedValueOnce(expectedResult);

      const result = await articlesController.findAll(paginationDto);

      expect(articlesService.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service and return expected value', async () => {
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
    const updateArticleDto = { title: 'title', description: 'description' };

    it('should call service', async () => {
      articlesService.update?.mockResolvedValueOnce(true);

      await articlesController.update(id, updateArticleDto, authUser);

      expect(articlesService.update).toHaveBeenCalledWith(
        id,
        updateArticleDto,
        authUser,
      );
    });

    it('should throw ForbiddenException', async () => {
      articlesService.update?.mockResolvedValueOnce(false);

      await expect(
        articlesController.update(id, updateArticleDto, authUser),
      ).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('createComment', () => {
    it('should call service and return expected value', async () => {
      const createCommentDto = { description: 'desc' };

      articlesService.createComment?.mockResolvedValueOnce(expectedResult);

      const result = await articlesController.createComment(
        createCommentDto,
        authUser,
        id,
      );

      expect(articlesService.createComment).toHaveBeenCalledWith(
        createCommentDto,
        authUser,
        id,
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('remove', () => {
    it('should throw ForbiddenException', async () => {
      articlesService.remove?.mockResolvedValueOnce(false);

      await expect(
        articlesController.remove(id, authUser),
      ).rejects.toThrowError(ForbiddenException);
      expect(articlesService.remove).toHaveBeenCalledWith(id, authUser);
    });

    it('should call service', async () => {
      articlesService.remove?.mockResolvedValueOnce(true);

      await articlesController.remove(id, authUser);

      expect(articlesService.remove).toHaveBeenCalledWith(id, authUser);
    });
  });
});
