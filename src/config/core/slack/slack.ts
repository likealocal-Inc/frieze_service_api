import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// 슬랙 세팅
// .env 파일에 해당 세팅
export const SlackAlertType = {
  IAMWEB_ORDER: process.env.SLACK_IAMWEB_ORDER
    ? process.env.SLACK_IAMWEB_ORDER
    : '',
  ORDER_DISPATCH_DATA_CHANGE: process.env.SLACK_ORDER_DISPATCH_DATA
    ? process.env.SLACK_ORDER_DISPATCH_DATA
    : '',
  ERROR: process.env.SLACK_ERROR ? process.env.SLACK_ERROR : '',
};

/**
 * 슬랙에 알림처리 유틸
 */
export class Slack {
  constructor(private readonly httpService: HttpService) {}

  /// 슬랙에 메세지 전송
  async send(type: string, mgs: string) {
    await firstValueFrom(
      await this.httpService
        .post(
          type,
          { text: mgs },
          { headers: { 'Content-type': 'application/json' } },
        )
        .pipe(),
    );
  }
}
