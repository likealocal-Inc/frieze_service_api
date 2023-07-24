import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EmailSendDto } from './dto/email.send.dto';
import { APIResponseObj, HttpUtils } from 'src/libs/core/utils/http.utils';
import { EmailService } from './email.service';

import { promises as fs } from 'fs';
import { Files } from 'src/config/core/files/files';

@Controller('email')
export class EmailController {
  constructor(private readonly cEamilService: EmailService) {}

  // /**
  //  * 이메일 전송
  //  * @param emailSendDtop
  //  * @returns
  //  */
  // @Post('/send')
  // sendEmail(@Body() emailSendDtop: EmailSendDto): APIResponseObj {
  //   this.cEamilService.send(emailSendDtop);
  //   return HttpUtils.makeAPIResponse(true);
  // }

  // @Post('/authEmail')
  // authEmail(@Body() body: any): APIResponseObj {
  //   this.cEamilService.authEmail(body.email, body.authUrl, body.userId);
  //   return HttpUtils.makeAPIResponse(true);
  // }

  // @Get()
  // async test(@Query() query) {
  //   try {
  //     const file = new Files();
  //     let data = await file.read('./static/mail.html');

  //     data = data.replace('__NAME__', query.name);
  //     this.cEamilService.authEmail2('hanblues@gmail.com', data);
  //     return data;
  //   } catch (err) {
  //     console.error(err);
  //     throw new Error('Failed to read file');
  //   }
  // }
}
