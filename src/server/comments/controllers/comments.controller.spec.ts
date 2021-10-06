import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'src/server/types';
import { CommentsService } from '../services/comments.service';
import { CommentsController } from './comments.controller';

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: MockType<CommentsService>;
  const authUser = {
    username: 'user',
    id: 'id',
    sessionVersion: '',
  };
  const id = 'id';
  const expectedResult = 'value';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useFactory: jest.fn(() => ({
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          })),
        },
      ],
    }).compile();

    commentsController = module.get<CommentsController>(CommentsController);
    commentsService = module.get(CommentsService);
  });

  describe('findOne', () => {
    it('should call service and return expected value', async () => {
      commentsService.findOne?.mockResolvedValueOnce(expectedResult);

      const result = await commentsController.findOne(id);

      expect(commentsService.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(expectedResult);
    });

    it('should throw NotFoundException', async () => {
      commentsService.findOne?.mockResolvedValueOnce(null);

      await expect(commentsController.findOne('')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateCommentDto = { description: '' };

    it('should call service', async () => {
      commentsService.update?.mockResolvedValueOnce(true);

      await commentsController.update(id, updateCommentDto, authUser);

      expect(commentsService.update).toHaveBeenCalledWith(
        id,
        updateCommentDto,
        authUser,
      );
    });

    it('should throw ForbiddenException', async () => {
      commentsService.update?.mockResolvedValueOnce(false);

      await expect(
        commentsController.update(id, updateCommentDto, authUser),
      ).rejects.toThrowError(ForbiddenException);
      expect(commentsService.update).toHaveBeenCalledWith(
        id,
        updateCommentDto,
        authUser,
      );
    });
  });

  describe('remove', () => {
    it('should call service', async () => {
      commentsService.remove?.mockResolvedValueOnce(true);

      await commentsController.remove(id, authUser);

      expect(commentsService.remove).toHaveBeenCalledWith(id, authUser);
    });

    it('should throw ForbiddenException', async () => {
      commentsService.remove?.mockResolvedValueOnce(false);

      await expect(
        commentsController.remove(id, authUser),
      ).rejects.toThrowError(ForbiddenException);
      expect(commentsService.remove).toHaveBeenCalledWith(id, authUser);
    });
  });
});
