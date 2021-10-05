import { Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthModule } from 'src/server/auth/auth.module';
import { MockType } from 'src/server/types';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: MockType<UsersService>;
  const expectedResult = 'value';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersRepository,
          useFactory: jest.fn(),
        },
        {
          provide: Logger,
          useFactory: jest.fn(),
        },
        {
          provide: UsersService,
          useFactory: jest.fn(() => ({
            createUser: jest.fn(),
            findUsers: jest.fn(),
            findUser: jest.fn(),
            removeUser: jest.fn(),
            updateUser: jest.fn(),
          })),
        },
        { provide: AuthModule, useFactory: jest.fn() },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('createUser', () => {
    it('should return expected value', async () => {
      usersService.createUser?.mockResolvedValue(expectedResult);

      const result = await usersController.createUser({
        username: '',
        email: '',
        password: '',
      });

      expect(usersService.createUser).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedResult);
    });
  });

  describe('findUsers', () => {
    const paginationDto = { page: 1, limit: 10 };

    it('should return expected value', async () => {
      usersService.findUsers?.mockResolvedValueOnce(expectedResult);

      const result = await usersController.findUsers(paginationDto);

      expect(result).toBe(expectedResult);
    });
  });

  describe('findUser', () => {
    it('should return expected value', async () => {
      usersService.findUser?.mockResolvedValueOnce(expectedResult);

      const result = await usersController.findUser('');

      expect(result).toBe(expectedResult);
    });

    it('should throw NotFoundException', async () => {
      usersService.findUser?.mockResolvedValueOnce(null);

      await expect(usersController.findUser('')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('removeUser', () => {
    it('should return expected value', async () => {
      usersService.removeUser?.mockResolvedValueOnce(expectedResult);

      const result = await usersController.removeUser('1', {
        id: '1',
        username: '',
        sessionVersion: '',
      });

      expect(result).toBe(expectedResult);
    });

    it('should throw ForbiddenException', async () => {
      usersService.removeUser?.mockResolvedValueOnce(expectedResult);

      await expect(
        usersController.removeUser('1', {
          id: '2',
          username: '',
          sessionVersion: '',
        }),
      ).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('updateUser', () => {
    it('should return expected value', async () => {
      usersService.updateUser?.mockResolvedValueOnce(expectedResult);

      const result = await usersController.updateUser(
        '1',
        {},
        {
          id: '1',
          username: '',
          sessionVersion: '',
        },
      );

      expect(result).toBe(expectedResult);
    });

    it('should throw ForbiddenException', async () => {
      usersService.updateUser?.mockResolvedValueOnce(expectedResult);

      await expect(
        usersController.updateUser(
          '1',
          {},
          {
            id: '2',
            username: '',
            sessionVersion: '',
          },
        ),
      ).rejects.toThrowError(ForbiddenException);
    });
  });
});
