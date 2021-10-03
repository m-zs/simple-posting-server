import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { configService } from '~server/config/config.service';
import { UsersRepository } from '~server/users/users.repository';
import { JWTPayload } from './jwt-payload.interface';
import { AuthUser } from '../auth-user.type';

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
