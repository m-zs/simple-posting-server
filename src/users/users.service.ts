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
      if (err.code === USER_ERRORS.DUPLICATE_USERNAME) {
        throw new ConflictException(
          `User with ${
            err?.detail?.includes('email')
              ? `email ${createUserDto.email}`
              : `username ${createUserDto.username}`
          } already exist`,
        );
      } else {
        this.logger.log(err);

        throw new InternalServerErrorException();
      }
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, _updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
