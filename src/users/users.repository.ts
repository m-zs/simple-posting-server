import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, password, email } = createUserDto;

    const newUser = this.create({
      username,
      email,
      password: await this.hashPassword(password),
    });

    await this.saveUser(newUser);
  }

  async findUsers(): Promise<User[]> {
    return await this.find();
  }

  async findUser(id: string): Promise<User | undefined> {
    return await this.findOne(id);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const { password } = updateUserDto;

    const g = await this.update(
      { id },
      {
        ...updateUserDto,
        ...(password && {
          password: await this.hashPassword(password),
        }),
      },
    );
    console.log(g);

    return;
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async saveUser(user: User): Promise<void> {
    await this.save(user);
  }
}
