import { HttpException } from '@nestjs/common';
import { ExceptionCode } from './exception.code';

/**
 * Core 에외
 */
export class CustomException extends HttpException {
  constructor(codeInfo: ExceptionCode, message = '') {
    const code = codeInfo.getCode();
    const codeMessage = `${codeInfo.getMessage()} ${message}`;
    super({ code, codeMessage }, codeInfo.getStatus());
  }
}
