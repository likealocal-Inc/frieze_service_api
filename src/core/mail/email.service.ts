import { Injectable } from '@nestjs/common';

import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { EmailSendDto } from './dto/email.send.dto';
import { ElseUtils } from 'src/libs/core/utils/else.utils';

@Injectable()
export class EmailService {
  private mail: Mail;

  constructor() {
    this.mail = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'likealocal.korea2@gmail.com',
        pass: 'qnrppwatbzdrzbun',
      },
    });
  }

  /**
   * 메일 전송
   * @param emailOption
   * @returns
   */
  async send(emailOption: EmailSendDto): Promise<void> {
    try {
      this.mail.sendMail(emailOption);
    } catch (err) {
      throw new CustomException(ExceptionCodeList.COMMON.EMAIL_SEND_ERROR, err);
    }
  }

  async authEmail(email, authUrl, userId): Promise<void> {
    try {
      await this.send(ElseUtils.makeAuthEmail(email, authUrl, userId));
    } catch (err) {
      throw new CustomException(ExceptionCodeList.COMMON.EMAIL_SEND_ERROR, err);
    }
  }
  authEmail2(email, html) {
    try {
      this.send(ElseUtils.makeAuthEmail2(email, html));
    } catch (err) {
      throw new CustomException(ExceptionCodeList.COMMON.EMAIL_SEND_ERROR, err);
    }
  }
}
