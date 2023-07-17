import { Module } from '@nestjs/common';
import { CUserService } from './c.user.service';
import { CUserController } from './c.user.controller';
import { PrismaModule } from 'src/config/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CUserController],
  providers: [CUserService],
  exports: [CUserService],
})
export class CUserModule {}
