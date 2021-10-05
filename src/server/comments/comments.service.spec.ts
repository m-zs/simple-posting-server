import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import sanitizeHtml from 'sanitize-html';

import { MockType } from 'src/server/types';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

jest.mock('sanitize-html');

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let commentsRepository: MockType<CommentsRepository>;
  const authUser = {
    username: 'user',
    id: 'id',
    sessionVersion: '',
  };
  const article = 'id';
  const expectedResult = 'value';
  const id = 'id';

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: CommentsRepository,
          useFactory: jest.fn(() => ({
            createComment: jest.fn(),
            updateComment: jest.fn(),
            findComment: jest.fn(),
            removeComment: jest.fn(),
          })),
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    commentsRepository = module.get(CommentsRepository);
  });

  describe('createForArticle', () => {
    const createCommentDto = {
      description: 'title',
      respondTo: 'uuid',
    };

    it('should call repository and return expected value', async () => {
      jest
        .spyOn(commentsService, 'findOne')
        .mockResolvedValueOnce({} as Comment);
      (sanitizeHtml as unknown as jest.Mock).mockImplementation((val) => val);
      commentsRepository.createComment?.mockResolvedValueOnce(expectedResult);

      const result = await commentsService.createForArticle(
        createCommentDto,
        authUser,
        article,
      );

      expect(commentsService.findOne).toHaveBeenCalledWith(
        createCommentDto.respondTo,
      );
      expect(sanitizeHtml).toHaveBeenCalled();
      expect(commentsRepository.createComment).toHaveBeenCalledWith(
        createCommentDto,
        authUser,
        article,
      );
      expect(result).toBe(expectedResult);
    });

    it('should call findOne and throw BadRequestException when comment is not found', async () => {
      jest.spyOn(commentsService, 'findOne').mockResolvedValueOnce(undefined);

      await expect(
        commentsService.createForArticle(createCommentDto, authUser, article),
      ).rejects.toThrowError(BadRequestException);

      expect(commentsService.findOne).toHaveBeenCalledWith(
        createCommentDto.respondTo,
      );
      expect(commentsRepository.createComment).toHaveBeenCalledTimes(0);
    });
  });

  describe('update', () => {
    const updateCommentDto = { description: '' };

    it('should call repository and return expected value', async () => {
      commentsRepository.updateComment?.mockResolvedValueOnce(expectedResult);
      jest
        .spyOn(commentsService, 'findOne')
        .mockResolvedValueOnce({} as Comment);

      const result = await commentsService.update(
        id,
        updateCommentDto,
        authUser,
      );

      expect(commentsService.findOne).toHaveBeenCalledWith(id);
      expect(commentsRepository.updateComment).toHaveBeenCalledWith(
        id,
        updateCommentDto,
        authUser,
      );
      expect(result).toBe(expectedResult);
    });

    it('should call findOne and throw NotFoundException when comment is not found', async () => {
      jest.spyOn(commentsService, 'findOne').mockResolvedValueOnce(undefined);

      await expect(
        commentsService.update(id, updateCommentDto, authUser),
      ).rejects.toThrowError(NotFoundException);

      expect(commentsService.findOne).toHaveBeenCalledWith(id);
      expect(commentsRepository.updateComment).toHaveBeenCalledTimes(0);
      expect(sanitizeHtml).toHaveBeenCalledTimes(0);
    });
  });

  describe('findOne', () => {
    it('should call repository and return expected value', async () => {
      commentsRepository.findComment?.mockResolvedValueOnce(expectedResult);

      const result = await commentsService.findOne(id);

      expect(commentsRepository.findComment).toHaveBeenCalledWith(id);
      expect(result).toBe(result);
    });
  });

  describe('remove', () => {
    it('should call repository and return expected value', async () => {
      commentsRepository.removeComment?.mockResolvedValueOnce(expectedResult);
      jest
        .spyOn(commentsService, 'findOne')
        .mockResolvedValueOnce({} as Comment);

      const result = await commentsService.remove(id, authUser);

      expect(commentsService.findOne).toHaveBeenCalledWith(id);
      expect(commentsRepository.removeComment).toHaveBeenCalledWith(
        id,
        authUser,
      );
      expect(result).toBe(expectedResult);
    });

    it('should call findOne and throw NotFoundException when comment is not found', async () => {
      jest.spyOn(commentsService, 'findOne').mockResolvedValueOnce(undefined);

      await expect(commentsService.remove(id, authUser)).rejects.toThrowError(
        NotFoundException,
      );

      expect(commentsService.findOne).toHaveBeenCalledWith(id);
      expect(commentsRepository.removeComment).toHaveBeenCalledTimes(0);
    });
  });
});
