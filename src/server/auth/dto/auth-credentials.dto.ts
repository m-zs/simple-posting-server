import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '~server/users/dto/create-user.dto';

export class AuthCredentialsDto extends OmitType(CreateUserDto, ['email']) {}
