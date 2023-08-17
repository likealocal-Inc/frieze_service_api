import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { HttpUtils } from 'src/libs/core/utils/http.utils';
import { SecurityUtils } from 'src/libs/core/utils/security.utils';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 주문데이터 생성 -> 결제정보 업데이트
   *
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

  @Get('orderWithUser/:orderId')
  async orderWithUser(@Param('orderId') orderId: string) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.findOrderWithUserById(orderId),
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

  @Get('list/:page/:size/:userId')
  async listUser(
    @Param('page') page,
    @Param('size') size,
    @Param('userId') userId,
  ) {
    try {
      const res = HttpUtils.makeAPIResponse(
        true,
        await this.orderService.listByUserId(+page, +size, userId),
      );
      return res;
    } catch (error) {
      console.log(error);
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST);
    }
  }

  @Get('list/:page/:size')
  async lis(@Param('page') page, @Param('size') size, @Query() query) {
    try {
      const res = HttpUtils.makeAPIResponse(
        true,
        await this.orderService.list(+page, +size, query),
      );
      return res;
    } catch (error) {
      console.log(error);
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST);
    }
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

  @Post('payment/cancel')
  async paymentCancel(@Body() body: any) {
    console.log(body);
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.paymentCancel(body.id),
    );
  }

  @Post('payment/admin/cancel')
  async paymentAdminCancel(@Body() body: any) {
    console.log(body);
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.paymentAdminCancel(
        body.id,
        body.managerId,
        body.type,
        body.reason,
      ),
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
