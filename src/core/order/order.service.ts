import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { PrismaService } from 'src/config/core/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 주문생성
   * @param createOrderDto
   * @returns
   */
  async create(createOrderDto: CreateOrderDto) {
    return await this.prisma.order.create({ data: createOrderDto });
  }

  /**
   * 사용자 아이디로 주문조회
   * @param userId
   * @returns
   */
  async findByUserId(userId: string) {
    return await this.prisma.order.findMany({ where: { userId } });
  }

  /**
   * 아이디로 조회
   * @param id
   * @returns
   */
  async findById(id: string) {
    return await this.prisma.order.findFirst({ where: { id } });
  }

  /**
   * 주문 업데이트하기
   * @param id
   * @param updateOrderDto
   * @returns
   */
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }
}
