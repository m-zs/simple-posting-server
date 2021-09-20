import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatePayloadExistsPipe } from 'src/shared/pipes/validate-payload-exist.pipe';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ type: [User] })
  async findUsers(): Promise<User[]> {
    return await this.usersService.findUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user' })
  @ApiResponse({ type: User })
  async findUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.findUser(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user data' })
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidatePayloadExistsPipe())
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string): Promise<void> {
    return this.usersService.removeUser(id);
  }
}
