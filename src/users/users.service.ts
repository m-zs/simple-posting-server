import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { USER_ERRORS } from './users.errors';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly logger: Logger,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    try {
      return await this.usersRepository.createUser(createUserDto);
    } catch (err) {
      const { email, username } = createUserDto;

      if (err.code === USER_ERRORS.DUPLICATE_USERNAME) {
        throw new ConflictException(
          `User with ${
            err?.detail?.includes('email')
              ? `email ${email}`
              : `username ${username}`
          } already exist`,
        );
      } else {
        this.logger.error(
          `Failed to create user with username: ${username}, email: ${email}`,
          err,
        );

        throw new InternalServerErrorException();
      }
    }
  }

  async findUsers(): Promise<User[]> {
    try {
      return await this.usersRepository.findUsers();
    } catch (err) {
      this.logger.error(`Failed to find users`, err);

      throw new InternalServerErrorException();
    }
  }

  async findUser(id: string): Promise<User | undefined> {
    try {
      return await this.usersRepository.findUser(id);
    } catch (err) {
      this.logger.error(`Failed to find user with id: ${id}`, err);

      throw new InternalServerErrorException();
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    return await this.usersRepository.updateUser(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
