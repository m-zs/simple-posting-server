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
            create: jest.fn(),
          })),
        },
      ],
    }).compile();

    commentsController = module.get<CommentsController>(CommentsController);
    commentsService = module.get(CommentsService);
  });

  describe('create', () => {
    it('should call service and return expected value', async () => {
      const createCommentDto = {
        articleId: 'id',
        description: 'description',
      };
      const authUser = {
        username: 'user',
        id: 'id',
        sessionVersion: '',
      };
      const expectedResult = 'value';

      commentsService.create?.mockResolvedValueOnce(expectedResult);

      const result = await commentsController.create(
        createCommentDto,
        authUser,
      );

      expect(commentsService.create).toHaveBeenCalledWith(
        createCommentDto,
        authUser,
      );
      expect(result).toBe(expectedResult);
    });
  });
});
