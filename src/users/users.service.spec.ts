import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { USER_ERRORS } from './users.errors';

import { MockType } from 'src/types';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: MockType<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersRepository,
          useFactory: jest.fn(() => ({
            createUser: jest.fn(),
            findUsers: jest.fn(),
            findUser: jest.fn(),
          })),
        },

        UsersService,
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  describe('createUser', () => {
    const userData = {
      username: '',
      email: '',
      password: '',
    };

    it('should return expected value', async () => {
      const expectedResult = 'value';

      usersRepository.createUser?.mockResolvedValue(expectedResult);

      const result = await usersService.createUser(userData);

      expect(result).toBe(expectedResult);
      expect(usersRepository.createUser).toHaveBeenCalledTimes(1);
    });

    it(`should throw ConfilctException when error with code: ${USER_ERRORS.DUPLICATE_USERNAME} occurs`, async () => {
      usersRepository.createUser?.mockImplementationOnce(() => {
        throw { code: USER_ERRORS.DUPLICATE_USERNAME };
      });

      await expect(usersService.createUser(userData)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('findUsers', () => {
    it('should return expected value', async () => {
      const expectedResult = 'value';

      usersRepository.findUsers?.mockResolvedValueOnce(expectedResult);

      const result = await usersService.findUsers();

      expect(result).toBe(expectedResult);
    });
  });

  describe('findUser', () => {
    it('should return expected value', async () => {
      const expectedResult = 'value';

      usersRepository.findUser?.mockResolvedValueOnce(expectedResult);

      const result = await usersService.findUser('id');

      expect(result).toBe(expectedResult);
    });
  });
});
