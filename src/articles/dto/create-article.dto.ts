import { MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty()
  @MinLength(10)
  @MaxLength(80)
  title: string;

  @ApiProperty()
  @MinLength(20)
  @MaxLength(4000)
  description: string;
}
