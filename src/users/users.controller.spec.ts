import { Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthModule } from 'src/auth/auth.module';
import { MockType } from 'src/types';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: MockType<UsersService>;

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
      const expectedResult = 'value';

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
    it('should return expected value', async () => {
      const expectedResult = 'value';

      usersService.findUsers?.mockResolvedValueOnce(expectedResult);

      const result = await usersController.findUsers();

      expect(result).toBe(expectedResult);
    });
  });

  describe('findUser', () => {
    it('should return expected value', async () => {
      const expectedResult = 'value';

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
      const expectedResult = 'value';

      usersService.removeUser?.mockResolvedValueOnce(expectedResult);

      const result = await usersController.removeUser('1', {
        id: '1',
        username: '',
        sessionVersion: '',
      });

      expect(result).toBe(expectedResult);
    });

    it('should throw ForbiddenException', async () => {
      const expectedResult = 'value';

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
      const expectedResult = 'value';

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
      const expectedResult = 'value';

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
