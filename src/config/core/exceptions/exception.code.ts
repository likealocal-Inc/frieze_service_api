import { HttpStatus } from '@nestjs/common';

export class ExceptionCode {
  constructor(
    private readonly code: string,
    private readonly message: string,
    private readonly status: number,
  ) {}
  getCode = () => this.code;
  getMessage = () => this.message;
  getStatus = () => this.status;
}

export const ExceptionCodeList = {
  PAYMENT: {
    WRONG: new ExceptionCode('WRONG', 'payment fail', HttpStatus.BAD_REQUEST),
  },
  AUTH: {
    UNAUTHORIZED: new ExceptionCode(
      'UNAUTHORIZED',
      'auth fail',
      HttpStatus.UNAUTHORIZED,
    ),
    WRONG_PASSWORD: new ExceptionCode(
      'WRONG_PASSWORD',
      'password fail',
      HttpStatus.UNAUTHORIZED,
    ),
    NO_SESSION_KEY: new ExceptionCode(
      'NO_SESSION_KEY',
      'no session key',
      HttpStatus.UNAUTHORIZED,
    ),
    WRONG_SESSION_KEY: new ExceptionCode(
      'WRONG_SESSION_KEY',
      '세션키가 오류',
      HttpStatus.UNAUTHORIZED,
    ),
    WRONG_ROLE: new ExceptionCode(
      'WRONG_ROLE',
      '권한 오류',
      HttpStatus.UNAUTHORIZED,
    ),
    TOKEN_FAIL: new ExceptionCode(
      'TOKEN_FAIL',
      '토큰 오류',
      HttpStatus.UNAUTHORIZED,
    ),
  },
  USER: {
    NOT_EXIST_EMAIL: new ExceptionCode(
      'NOT_EXIST_EMAIL',
      '이메일 존재',
      HttpStatus.BAD_REQUEST,
    ),
    ALREADY_EXIST_USER: new ExceptionCode(
      'ALREADY_EXIST_USER',
      '이미 사용자 존재',
      HttpStatus.BAD_REQUEST,
    ),
  },
  MANAGER: {
    ALREADY_EXIST_MANAGER: new ExceptionCode(
      'ALREADY_EXIST_USER',
      '이미 사용자 존재',
      HttpStatus.BAD_REQUEST,
    ),
    FAIL_LOGIN: new ExceptionCode(
      'FAIL_LOGIN',
      '로그인 실패 오류',
      HttpStatus.BAD_REQUEST,
    ),
  },
  COMMON: {
    WRONG_REQUEST: new ExceptionCode(
      'WRONG_REQUEST',
      '요청 오류',
      HttpStatus.BAD_REQUEST,
    ),
    EMAIL_SEND_ERROR: new ExceptionCode(
      'EMAIL_SEND_ERROR',
      '이메일 전송오류',
      HttpStatus.BAD_REQUEST,
    ),
  },
  FILE: {
    FILE_NOT_FOUND: new ExceptionCode(
      'FILE_NOT_FOUND',
      '파일 없음',
      HttpStatus.BAD_REQUEST,
    ),
  },
};
