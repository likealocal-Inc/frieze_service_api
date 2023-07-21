import { Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { PrismaModule } from 'src/config/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InfoController],
  providers: [InfoService],
})
export class InfoModule {}
