import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ValidatePayloadExistsPipe } from 'src/shared/pipes/validate-payload-exist.pipe';
import { ConflictInterceptor } from 'src/shared/interceptors/conflict.interceptor';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthUser } from 'src/auth/auth-user.type';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(ConflictInterceptor)
  @ApiOperation({ summary: 'Create new user' })
  @HttpCode(204)
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
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiResponse({ type: User })
  async findUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.findUser(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update user data' })
  @ApiParam({ name: 'id', description: 'User id' })
  @UseInterceptors(ConflictInterceptor)
  @HttpCode(204)
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidatePayloadExistsPipe())
    updateUserDto: UpdateUserDto,
    @GetUser() user: AuthUser,
  ): Promise<void> {
    if (id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User id' })
  @HttpCode(204)
  async removeUser(
    @Param() id: string,
    @GetUser() user: AuthUser,
  ): Promise<void> {
    if (id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.usersService.removeUser(id);
  }
}
