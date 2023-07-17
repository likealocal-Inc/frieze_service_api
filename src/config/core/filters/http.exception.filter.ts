import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpUtils } from 'src/libs/core/utils/http.utils';
import { LogFiles } from '../files/log.files';

/**
 * 에러처리 필터
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const res: any = exception.getResponse();

    const errData = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      code: res.code ? res.code : res,
      description: res.message ? res.message : res,
    };
    const data = HttpUtils.makeAPIResponse(false, errData);

    // 로그파일 작성
    new LogFiles().save(JSON.stringify(errData));

    response.status(500).json(data);
  }
}
