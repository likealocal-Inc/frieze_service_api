import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 주문생성
   * @param createOrderDto
   * @returns
   */
  async create(createOrderDto: CreateOrderDto) {
    try {
      await this.prisma.order.create({ data: createOrderDto });
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  /**
   * 사용자 아이디로 주문조
   * @param userId
   * @returns
   */
  async findByUserId(userId: string) {
    try {
      return await this.prisma.order.findMany({ where: { userId } });
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  /**
   * 아이디로 조회
   * @param id
   * @returns
   */
  async findById(id: string) {
    try {
      return await this.prisma.order.findFirst({ where: { id } });
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  /**
   * 주문 업데이트하기
   * @param id
   * @param updateOrderDto
   * @returns
   */
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
      });
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }
}
