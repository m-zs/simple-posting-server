import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersRepository,
          useClass: jest.fn(),
        },
        { provide: Logger, useClass: jest.fn() },
        UsersService,
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should return void', async () => {
      const expectedResult = undefined;
      const createSpy = jest
        .spyOn(usersService, 'createUser')
        .mockImplementation(() => Promise.resolve(expectedResult));

      const result = await usersController.createUser({
        username: '',
        email: '',
        password: '',
      });

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedResult);
    });
  });
});
