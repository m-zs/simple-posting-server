import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { MockType } from 'src/server/types';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: MockType<AuthService>;
  const res: Partial<Response> = { cookie: jest.fn(), clearCookie: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: jest.fn(() => ({
            signIn: jest.fn(),
            signOut: jest.fn(),
            refresh: jest.fn(),
          })),
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('signin', () => {
    it('should return expected value, call service, and res.cookie', async () => {
      const credentials = { username: 'user', password: 'password' };
      const accessToken = 'token';
      const refreshToken = 'token';

      authService.signIn?.mockResolvedValueOnce({ accessToken, refreshToken });

      const response = await authController.signIn(
        credentials,
        res as Response,
      );

      expect(authService.signIn).toHaveBeenCalledWith(credentials);
      expect(res.cookie).toHaveBeenCalledWith('rtc', refreshToken, {
        httpOnly: true,
      });
      expect(response).toMatchObject({ accessToken });
    });
  });

  describe('signout', () => {
    it('should call serivice and res.cookie', async () => {
      const authUser = {
        id: '',
        username: '',
        sessionVersion: '',
      };

      authService.signOut?.mockResolvedValueOnce(null);

      await authController.singOut(authUser, res as Response);

      expect(authService.signOut).toHaveBeenCalledWith(authUser);
      expect(res.clearCookie).toHaveBeenCalledWith('rtc');
    });
  });

  describe('refresh', () => {
    it('should call serivice and res.cookie', async () => {
      const authUser = {
        id: '',
        username: '',
        sessionVersion: '',
      };
      const accessToken = 'token';
      const refreshToken = 'token';

      authService.refresh?.mockResolvedValueOnce({ accessToken, refreshToken });

      await authController.refresh(authUser, res as Response);

      expect(authService.refresh).toHaveBeenCalledWith(authUser);
      expect(res.cookie).toHaveBeenCalledWith('rtc', refreshToken, {
        httpOnly: true,
      });
    });
  });
});
