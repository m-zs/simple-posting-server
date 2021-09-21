import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

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

    return {
      accessToken: this.jwtService.sign({ username }, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign({ username }, { expiresIn: '7d' }),
    };
  }
}
