import { Body, Controller, Post } from '@nestjs/common';
import { EmailSendDto } from './dto/email.send.dto';
import { APIResponseObj, HttpUtils } from 'src/libs/core/utils/http.utils';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly cEamilService: EmailService) {}

  /**
   * 이메일 전송
   * @param emailSendDtop
   * @returns
   */
  @Post('/send')
  sendEmail(@Body() emailSendDtop: EmailSendDto): APIResponseObj {
    this.cEamilService.send(emailSendDtop);
    return HttpUtils.makeAPIResponse(true);
  }
}
