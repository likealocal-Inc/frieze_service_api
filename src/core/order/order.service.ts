import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { DateUtils } from 'src/libs/core/utils/date.utils';

export enum STATUS {
  PAYMENT = 'PAYMENT',
  DISPATCH_REQUEST = 'DISPATCH_REQUEST',
  CANCEL_REQUEST = 'CANCEL_REQUEST',
  CANCEL_DONE = 'CANCEL_DONE',
  DISPATCH_DONE = 'DISPATCH_DONE',
  DONE = 'DONE',
}
export function isValidSTATUS(value: any): value is STATUS {
  return Object.values(STATUS).includes(value);
}

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async setStatus(id: string, status: string) {
    // 상태값 확인
    if (isValidSTATUS(status) === false) {
      throw new CustomException(
        ExceptionCodeList.COMMON.WRONG_REQUEST,
        'worng status',
      );
    }

    try {
      await this.prisma.order.update({
        where: { id },
        data: { status: status },
      });
      return status;
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  /**
   * 주문생성
   * @param createOrderDto
   * @returns
   */
  async create(createOrderDto: CreateOrderDto) {
    try {
      const now = DateUtils.nowString('YYYY-MM-DD hh:mm');
      return await this.prisma.order.create({
        data: {
          ...createOrderDto,
          approvalDate: now,
          status: STATUS.PAYMENT.toString(),
        },
      });
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
      return await this.prisma.order.findMany({
        where: { userId },
        orderBy: { created: 'desc' },
      });
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
