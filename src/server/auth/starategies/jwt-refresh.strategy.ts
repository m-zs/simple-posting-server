import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UsersRepository } from 'src/server/users/repositories/users.repository';
import { configService } from 'src/server/config';
import { AuthUser } from '../types/auth-user.type';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {
    super({
      secretOrKey: configService.getValue('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.rtc,
      ]),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JWTPayload): Promise<AuthUser> {
    const { id } = payload;
    const user = await this.usersRepository.findUser(id);

    if (!user || req?.cookies?.rtc !== user.sessionVersion) {
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
