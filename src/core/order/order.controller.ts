import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { HttpUtils } from 'src/libs/core/utils/http.utils';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
}
