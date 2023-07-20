import { Module } from '@nestjs/common';
import { CUserService } from './c.user.service';
import { CUserController } from './c.user.controller';
import { PrismaModule } from 'src/config/core/prisma/prisma.module';
import { EmailModule } from '../mail/email.module';
import { EmailService } from '../mail/email.service';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [CUserController],
  providers: [CUserService, EmailService],
  exports: [CUserService],
})
export class CUserModule {}
