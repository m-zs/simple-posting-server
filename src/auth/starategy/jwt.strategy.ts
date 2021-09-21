import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { configService } from 'src/config/config.service';
import { UsersRepository } from 'src/users/users.repository';
import { JWTPayload } from './jwt-payload.interface';
import { AuthUser } from '../auth-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {
    super({
      secretOrKey: configService.getValue('JWT_SECRET'),
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
