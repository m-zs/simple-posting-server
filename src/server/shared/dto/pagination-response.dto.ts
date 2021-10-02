import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginationResponseDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  items: T[];

  @ApiProperty()
  meta: PaginationMetaDto;
}
