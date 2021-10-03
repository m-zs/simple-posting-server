import { User } from 'src/server//users/entities/user.entity';

export interface AuthUser {
  id: User['id'];
  username: User['username'];
  sessionVersion: User['sessionVersion'];
}
