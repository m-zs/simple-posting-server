import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { configService } from 'src/config';
import { UsersRepository } from 'src/users/users.repository';
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

    const refreshToken = this.jwtService.sign(
      { username, id: user.id },
      {
        expiresIn: '7d',
        secret: configService.getValue('JWT_REFRESH_SECRET'),
      },
    );

    await this.usersRepository.updateSession(user.id, refreshToken);

    return {
      accessToken: this.jwtService.sign(
        { username, id: user.id },
        {
          expiresIn: '1h',
          secret: configService.getValue('JWT_ACCESS_SECRET'),
        },
      ),
      refreshToken,
    };
  }
}
