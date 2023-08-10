import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { HttpUtils } from 'src/libs/core/utils/http.utils';
import { SecurityUtils } from 'src/libs/core/utils/security.utils';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 주문데이터 생성 -> 결제정보 업데이트
   * @param createOrderDto
   * @returns
   */
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.create(createOrderDto),
    );
  }

  @Get('userid/:id')
  async findByUserId(@Param('id') id: string) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.findByUserId(id),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.findById(id),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.update(id, updateOrderDto),
    );
  }

  @Get('status/:id/:status')
  async setStatus(@Param('id') id: string, @Param('status') status: string) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.setStatus(id, status),
    );
  }

  @Post('payment/init')
  async paymentInit(@Body() body: any) {
    if (body.kdjifnkd44333 === null || body.kdjifnkd44333 === undefined) {
      return false;
    }
    const param = JSON.parse(SecurityUtils.decryptText(body.kdjifnkd44333));

    return await this.orderService.paymentInit(
      param.price,
      param.email,
      param.tempKey,
    );
  }

  // @Patch('payment/payresult')
  // async payresult(@Body() body: any) {
  //   try {
  //     const data = SecurityUtils.decryptText(body.aeindifo);

  //     if (data === null || data === undefined) {
  //       return HttpUtils.makeAPIResponse(false);
  //     }

  //     const dataJson = JSON.parse(data);

  //     return HttpUtils.makeAPIResponse(
  //       true,
  //       await this.orderService.payresult(
  //         dataJson.id,
  //         dataJson.authToken,
  //         dataJson.signature,
  //         dataJson.txTid,
  //       ),
  //     );
  //   } catch (err) {
  //     console.log(err.response.data);
  //     return HttpUtils.makeAPIResponse(false, err.response.data);
  //   }
  // }
}
