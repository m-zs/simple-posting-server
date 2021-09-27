import { Test, TestingModule } from '@nestjs/testing';
import sanitizeHtml from 'sanitize-html';

import { MockType } from 'src/types';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';

jest.mock('sanitize-html');

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let commentsRepository: MockType<CommentsRepository>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: CommentsRepository,
          useFactory: jest.fn(() => ({ createComment: jest.fn() })),
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    commentsRepository = module.get(CommentsRepository);
  });

  describe('create', () => {
    it('should call repository and return expected value', async () => {
      const createCommentDto = {
        description: 'title',
        articleId: 'id',
      };
      const authUser = {
        username: 'user',
        id: 'id',
        sessionVersion: '',
      };
      const article = 'id';
      const expectedResult = 'value';

      (sanitizeHtml as unknown as jest.Mock).mockImplementation((val) => val);
      commentsRepository.createComment?.mockResolvedValueOnce(expectedResult);

      const result = await commentsService.createForArticle(
        createCommentDto,
        authUser,
        article,
      );

      expect(sanitizeHtml).toHaveBeenCalled();
      expect(commentsRepository.createComment).toHaveBeenCalledWith(
        createCommentDto,
        authUser,
        article,
      );
      expect(result).toBe(expectedResult);
    });
  });
});
