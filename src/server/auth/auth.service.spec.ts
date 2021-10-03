import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { MockType } from 'src/server//types';
import { UsersRepository } from 'src/server//users/users.repository';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: MockType<UsersRepository>;
  let jwtService: MockType<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useFactory: jest.fn(() => ({
            findUserByUsername: jest.fn(),
            updateSession: jest.fn(),
          })),
        },
        {
          provide: JwtService,
          useFactory: jest.fn(() => ({
            sign: jest.fn(),
          })),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  describe('signIn', () => {
    it('should return expected value and update session', async () => {
      const user = {
        id: '',
        username: '',
        password: '',
        userSession: '',
      };
      const token = 'token';
      const authUser = { username: 'user', password: 'pass' };

      usersRepository.findUserByUsername?.mockResolvedValueOnce(user);
      usersRepository.updateSession?.mockImplementationOnce(jest.fn());
      jwtService.sign?.mockReturnValue(token);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);

      const result = await authService.signIn(authUser);

      expect(usersRepository.findUserByUsername).toHaveBeenCalledWith(
        authUser.username,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        authUser.password,
        user.password,
      );
      expect(usersRepository.updateSession).toHaveBeenCalledWith(
        user.id,
        token,
      );
      expect(result).toMatchObject({ accessToken: token, refreshToken: token });
    });

    it('should throw UnauthorizedException if user is not valid', async () => {
      usersRepository.findUserByUsername?.mockResolvedValueOnce(null);

      await expect(
        authService.signIn({ username: '', password: '' }),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is not valid', async () => {
      const authUser = {
        password: 'pass',
        username: '',
      };
      const user = {
        username: '',
        password: 'other pass',
      };

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);
      usersRepository.findUserByUsername?.mockResolvedValueOnce(user);

      await expect(authService.signIn(authUser)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        authUser.password,
        user.password,
      );
    });
  });

  describe('refresh', () => {
    it('should return expected value and update session', async () => {
      const token = 'token';
      const authUser = { username: 'user', id: 'id', sessionVersion: 'sess' };

      jwtService.sign?.mockReturnValue(token);
      usersRepository.updateSession?.mockImplementationOnce(jest.fn());

      const result = await authService.refresh(authUser);

      expect(usersRepository.updateSession).toHaveBeenCalledWith(
        authUser.id,
        token,
      );
      expect(result).toMatchObject({ accessToken: token, refreshToken: token });
    });
  });

  describe('signOut', () => {
    it('should update session', async () => {
      const authUser = { username: 'user', id: 'id', sessionVersion: 'sess' };

      usersRepository.updateSession?.mockImplementationOnce(jest.fn());

      await authService.signOut(authUser);

      expect(usersRepository.updateSession).toHaveBeenCalledWith(
        authUser.id,
        undefined,
      );
    });
  });
});
