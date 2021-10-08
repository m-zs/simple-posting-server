import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

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

  async findUsers(options: IPaginationOptions): Promise<Pagination<User>> {
    return await paginate<User>(this, options);
  }

  async findUser(id: string): Promise<User | undefined> {
    return await this.findOne(id);
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    return await this.findOne({ username });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const { password } = updateUserDto;

    await this.update(
      { id },
      {
        ...updateUserDto,
        ...(password && {
          password: await this.hashPassword(password),
        }),
      },
    );
  }

  async removeUser(id: string): Promise<void> {
    await this.delete(id);
  }

  async updateSession(id: string, sessionVersion?: string): Promise<void> {
    await this.update({ id }, { sessionVersion });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async saveUser(user: User): Promise<void> {
    await this.save(user);
  }
}
