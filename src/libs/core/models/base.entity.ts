import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty()
  id: number;
  @ApiProperty()
  created: Date;
  @ApiProperty()
  updated: Date;
}
