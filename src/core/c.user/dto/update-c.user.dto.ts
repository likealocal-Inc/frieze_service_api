import { PartialType } from '@nestjs/swagger';
import { CreateCUserDto } from './create-c.user.dto';

export class UpdateCUserDto extends PartialType(CreateCUserDto) {}
