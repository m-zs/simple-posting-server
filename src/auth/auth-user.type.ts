import { User } from 'src/users/entities/user.entity';

export interface AuthUser {
  id: User['id'];
  username: User['username'];
  sessionVersion: User['sessionVersion'];
}
