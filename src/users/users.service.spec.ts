import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'src/types';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: MockType<UsersRepository>;
  const expectedResult = 'value';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersRepository,
          useFactory: jest.fn(() => ({
            createUser: jest.fn(),
            findUsers: jest.fn(),
            findUser: jest.fn(),
            removeUser: jest.fn(),
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
      usersRepository.createUser?.mockResolvedValue(expectedResult);

      const result = await usersService.createUser(userData);

      expect(result).toBe(expectedResult);
      expect(usersRepository.createUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUsers', () => {
    const paginationDto = { page: 1, limit: 10 };

    it('should return expected value', async () => {
      usersRepository.findUsers?.mockResolvedValueOnce(expectedResult);

      const result = await usersService.findUsers(paginationDto);

      expect(result).toBe(expectedResult);
    });
  });

  describe('findUser', () => {
    it('should return expected value', async () => {
      usersRepository.findUser?.mockResolvedValueOnce(expectedResult);

      const result = await usersService.findUser('id');

      expect(result).toBe(expectedResult);
    });
  });

  describe('removeUser', () => {
    it('should return expected value', async () => {
      usersRepository.removeUser?.mockResolvedValueOnce(expectedResult);

      const result = await usersService.removeUser('id');

      expect(result).toBe(expectedResult);
    });
  });
});
