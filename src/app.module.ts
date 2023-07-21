import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { join } from 'path';
import { PrismaModule } from './config/core/prisma/prisma.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './config/core/interceptor/logger.interceptor';
import { LoggerMiddleware } from './config/core/middleware/http.logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { CUserModule } from './core/c.user/c.user.module';
import { HttpExceptionFilter } from './config/core/filters/http.exception.filter';
import { OrderModule } from './core/order/order.module';
import { EmailModule } from './core/mail/email.module';
import { InfoModule } from './core/info/info.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      exclude: ['/api*', '/docs*'],
    }),
    ConfigModule,
    ConfigModule.forRoot({ envFilePath: [`.env.${process.env.NODE_ENV}`] }),
    PrismaModule,
    JwtModule,

    ///////////////////
    CUserModule,

    OrderModule,

    EmailModule,

    InfoModule,
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
