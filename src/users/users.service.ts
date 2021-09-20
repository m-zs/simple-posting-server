import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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

  async findUsers(): Promise<User[]> {
    return await this.usersRepository.findUsers();
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

  async removeUser(_id: string): Promise<void> {
    return;
  }
}
