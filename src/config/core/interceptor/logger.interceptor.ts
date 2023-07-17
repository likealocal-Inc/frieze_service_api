import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * 인터셉터 - 로그처리
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('LoggingInterceptor Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`LoggingInterceptor After... ${Date.now() - now}ms`),
        ),
      );
  }
}
