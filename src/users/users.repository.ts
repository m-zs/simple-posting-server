import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.save(newUser);
  }
}
