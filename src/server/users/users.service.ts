import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    return await this.usersRepository.createUser(createUserDto);
  }

  async findUsers(options: IPaginationOptions): Promise<Pagination<User>> {
    return await this.usersRepository.findUsers(options);
  }

  async findUser(id: string): Promise<User> {
    const user = await this.usersRepository.findUser(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    return await this.usersRepository.updateUser(id, updateUserDto);
  }

  async removeUser(id: string): Promise<void> {
    return await this.usersRepository.removeUser(id);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate(this.usersRepository, options);
  }
}
