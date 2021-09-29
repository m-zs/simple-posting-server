import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'src/types';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: MockType<CommentsService>;
  const authUser = {
    username: 'user',
    id: 'id',
    sessionVersion: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useFactory: jest.fn(() => ({
            findOne: jest.fn(),
            update: jest.fn(),
          })),
        },
      ],
    }).compile();

    commentsController = module.get<CommentsController>(CommentsController);
    commentsService = module.get(CommentsService);
  });

  it('default', () => {
    expect(commentsController).toBeDefined();
    expect(commentsService).toBeDefined();
  });

  describe('findOne', () => {
    it('should call service and return expected value', async () => {
      const id = 'id';
      const expectedResult = 'value';

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
    const id = 'id';
    const updateCommentDto = {};

    it('should call service', async () => {
      const expectedResult = true;

      commentsService.update?.mockResolvedValueOnce(expectedResult);

      await commentsController.update(id, updateCommentDto, authUser);

      expect(commentsService.update).toHaveBeenCalledWith(
        id,
        updateCommentDto,
        authUser,
      );
    });

    it('should throw ForbiddenException', async () => {
      const expectedResult = false;

      commentsService.update?.mockResolvedValueOnce(expectedResult);

      await expect(
        commentsController.update(id, updateCommentDto, authUser),
      ).rejects.toThrowError(ForbiddenException);
    });
  });
});
