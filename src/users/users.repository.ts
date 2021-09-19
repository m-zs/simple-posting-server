import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, password, email } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.save(newUser);
  }

  async findUsers(): Promise<User[]> {
    return await this.find();
  }

  async findUser(id: string): Promise<User | undefined> {
    return await this.findOne(id);
  }
}
