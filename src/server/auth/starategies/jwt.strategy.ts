import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersRepository } from 'src/server/users/repositories/users.repository';
import { configService } from 'src/server/config';
import { AuthUser } from '../types/auth-user.type';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {
    super({
      secretOrKey: configService.getValue('JWT_ACCESS_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JWTPayload): Promise<AuthUser> {
    const { id } = payload;
    const user = await this.usersRepository.findUser(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    // this is injected as req.user
    return {
      username: user.username,
      id: user.id,
      sessionVersion: user.sessionVersion,
    };
  }
}
