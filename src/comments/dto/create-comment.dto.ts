import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @MinLength(2)
  @MaxLength(1000)
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  respondTo?: string;
}
