import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/server//users/dto/create-user.dto';

export class AuthCredentialsDto extends OmitType(CreateUserDto, ['email']) {}
