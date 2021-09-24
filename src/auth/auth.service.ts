import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { configService } from 'src/config';
import { UsersRepository } from 'src/users/users.repository';
import { AuthUser } from './auth-user.type';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findUserByUsername(username);

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshToken = this.createRefreshToken(username, user.id);

    await this.usersRepository.updateSession(user.id, refreshToken);

    return {
      accessToken: this.createAccessToken(username, user.id),
      refreshToken,
    };
  }

  async refresh(
    user: AuthUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, id } = user;

    const refreshToken = this.createRefreshToken(username, id);

    await this.usersRepository.updateSession(id, refreshToken);

    return {
      accessToken: this.createAccessToken(username, id),
      refreshToken,
    };
  }

  async signOut(user: AuthUser): Promise<void> {
    await this.usersRepository.updateSession(user.id, undefined);
  }

  private createRefreshToken = (username: string, id: string): string => {
    return this.jwtService.sign(
      { username, id: id },
      {
        expiresIn: '7d',
        secret: configService.getValue('JWT_REFRESH_SECRET'),
      },
    );
  };

  private createAccessToken = (username: string, id: string): string => {
    return this.jwtService.sign(
      { username, id: id },
      {
        expiresIn: '7d',
        secret: configService.getValue('JWT_ACCESS_SECRET'),
      },
    );
  };
}
