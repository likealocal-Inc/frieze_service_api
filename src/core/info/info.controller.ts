import { Controller, Get, Param } from '@nestjs/common';
import { InfoService } from './info.service';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get()
  async findOne() {
    return await this.infoService.findOne();
  }

  @Get('/dlrjtdmfupte/:value/:token')
  async updateRage(
    @Param('value') value: string,
    @Param('token') token: string,
  ) {
    return await this.infoService.updateRate(+value, token);
  }
}
