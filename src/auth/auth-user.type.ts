import { User } from 'src/users/entities/user.entity';

export type AuthUser = Omit<User, 'password' | 'email' | 'articles'>;
