import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

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
          useFactory: jest.fn(() => ({ createUser: jest.fn() })),
        },
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
});
