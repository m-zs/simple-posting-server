import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  ParseUUIDPipe,
  NotFoundException,
  ForbiddenException,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

import { PaginationResponse } from 'src/server//shared/decorators/pagination-response.decorator';
import { PaginationDto } from 'src/server//shared/dto/pagination.dto';
import { ValidatePayloadExistsPipe } from 'src/server//shared/pipes/validate-payload-exist.pipe';
import { GetUser } from 'src/server//auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/server//auth/guards/jwt.guard';
import { AuthUser } from 'src/server//auth/auth-user.type';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('api/users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @HttpCode(204)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Get users' })
  @PaginationResponse(User)
  async findUsers(
    @Query() paginationDto: PaginationDto,
  ): Promise<Pagination<User>> {
    return await this.usersService.findUsers({ ...paginationDto });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiResponse({ type: User })
  async findUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const user = await this.usersService.findUser(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update user data' })
  @ApiParam({ name: 'id', description: 'User id' })
  @HttpCode(204)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidatePayloadExistsPipe())
    updateUserDto: UpdateUserDto,
    @GetUser() user: AuthUser,
  ): Promise<void> {
    if (id !== user.id) {
      throw new ForbiddenException();
    }

    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User id' })
  @HttpCode(204)
  async removeUser(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: AuthUser,
  ): Promise<void> {
    if (id !== user.id) {
      throw new ForbiddenException();
    }

    return this.usersService.removeUser(id);
  }
}
