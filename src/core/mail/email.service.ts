import { Injectable } from '@nestjs/common';

import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { EmailSendDto } from './dto/email.send.dto';

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
  send(emailOption: EmailSendDto): void {
    try {
      this.mail.sendMail(emailOption);
    } catch (err) {
      throw new CustomException(ExceptionCodeList.COMMON.EMAIL_SEND_ERROR, err);
    }
  }
}
