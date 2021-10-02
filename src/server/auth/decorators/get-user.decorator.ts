import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from 'src/server/users/entities/user.entity';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): Omit<User, 'password' | 'email'> => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
