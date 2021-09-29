import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'src/types';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: MockType<CommentsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useFactory: jest.fn(() => ({
            findOne: jest.fn(),
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
});
